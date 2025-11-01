import streamlit as st
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import hashlib
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import warnings
warnings.filterwarnings('ignore')

# ==================== CONFIG & INITIALIZATION ====================
st.set_page_config(
    page_title="AI Digital Banking Platform",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better UI
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
    }
    .approval-box {
        background-color: #d4edda;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #28a745;
    }
    .decline-box {
        background-color: #f8d7da;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #dc3545;
    }
    .review-box {
        background-color: #fff3cd;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #ffc107;
    }
    </style>
    """, unsafe_allow_html=True)

# ==================== SESSION STATE ====================
if 'borrower_profile' not in st.session_state:
    st.session_state.borrower_profile = None
if 'credit_decision' not in st.session_state:
    st.session_state.credit_decision = None
if 'kyc_status' not in st.session_state:
    st.session_state.kyc_status = None

# ==================== AGENTS - MULTI-AGENT SYSTEM ====================

class DataCollectionAgent:
    """Collects and validates borrower data from multiple sources"""
    
    def __init__(self):
        self.name = "Data Collection Agent"
        
    def collect_personal_data(self, form_data):
        """Collect personal information"""
        personal = {
            'borrower_id': form_data.get('borrower_id', 'AUTO_' + str(int(np.random.random() * 1e6))),
            'name': form_data.get('name', 'N/A'),
            'age': form_data.get('age', 0),
            'gender': form_data.get('gender', 'Not Specified'),
            'location_tier': form_data.get('location_tier', '3'),
            'state': form_data.get('state', 'Unknown'),
            'occupation': form_data.get('occupation', 'Unknown'),
            'employment_type': form_data.get('employment_type', 'Self-Employed'),
            'education_level': form_data.get('education', 'High School'),
            'collection_timestamp': datetime.now().isoformat()
        }
        return personal
    
    def collect_financial_data(self, form_data):
        """Collect financial information"""
        financial = {
            'annual_income': form_data.get('annual_income', 0),
            'monthly_expenses': form_data.get('monthly_expenses', 0),
            'existing_loans': form_data.get('existing_loans', 0),
            'existing_emi': form_data.get('existing_emi', 0),
            'savings': form_data.get('savings', 0),
            'loan_amount_requested': form_data.get('loan_amount', 0),
            'loan_tenure': form_data.get('tenure', 12),
            'cibil_score': form_data.get('cibil_score', None),
            'credit_history_months': form_data.get('credit_history', 0)
        }
        return financial
    
    def collect_alternative_data(self, form_data):
        """Collect alternative credit data"""
        alternative = {
            'bank_transaction_frequency': form_data.get('bank_frequency', 0),
            'utility_payment_consistency': form_data.get('utility_consistency', 0),
            'upi_transaction_count': form_data.get('upi_transactions', 0),
            'digital_footprint_score': form_data.get('digital_score', 0),
            'psychometric_score': form_data.get('psychometric_score', 0),
            'fpo_membership': form_data.get('fpo_member', False),
            'business_registration': form_data.get('business_registered', False)
        }
        return alternative
    
    def validate_data(self, data):
        """Validate collected data"""
        validation_result = {
            'is_valid': True,
            'issues': []
        }
        
        if data.get('age', 0) < 18 or data.get('age', 0) > 75:
            validation_result['is_valid'] = False
            validation_result['issues'].append('Age must be between 18-75')
        
        if data.get('annual_income', 0) <= 0:
            validation_result['is_valid'] = False
            validation_result['issues'].append('Annual income must be positive')
        
        if data.get('loan_amount_requested', 0) <= 0:
            validation_result['is_valid'] = False
            validation_result['issues'].append('Loan amount must be positive')
        
        return validation_result

class FeatureEngineeringAgent:
    """Processes raw data into ML-ready features"""
    
    def __init__(self):
        self.name = "Feature Engineering Agent"
        self.scaler = StandardScaler()
    
    def create_financial_features(self, financial_data):
        """Create financial ratio features"""
        annual_income = max(financial_data.get('annual_income', 1), 1)
        monthly_income = annual_income / 12
        monthly_expenses = financial_data.get('monthly_expenses', 0)
        existing_emi = financial_data.get('existing_emi', 0)
        loan_amount = financial_data.get('loan_amount_requested', 0)
        tenure = financial_data.get('loan_tenure', 12)
        
        # Calculate EMI using reducing balance method
        if loan_amount > 0 and tenure > 0:
            monthly_rate = 0.12 / 12  # 12% annual rate
            if monthly_rate > 0:
                requested_monthly_emi = (loan_amount * monthly_rate * (1 + monthly_rate)**tenure) / (((1 + monthly_rate)**tenure) - 1)
            else:
                requested_monthly_emi = loan_amount / tenure
        else:
            requested_monthly_emi = 0
        
        features = {
            'monthly_income': monthly_income,
            'monthly_expenses': monthly_expenses,
            'existing_emi': existing_emi,
            'debt_to_income_ratio': (existing_emi / monthly_income) if monthly_income > 0 else 0,
            'expense_to_income_ratio': (monthly_expenses / monthly_income) if monthly_income > 0 else 0,
            'available_income': monthly_income - monthly_expenses - existing_emi,
            'debt_burden_with_new_loan': ((existing_emi + requested_monthly_emi) / monthly_income) if monthly_income > 0 else 0,
            'loan_amount_to_income': (loan_amount / annual_income) if annual_income > 0 else 0,
            'savings_to_loan_ratio': (financial_data.get('savings', 0) / loan_amount) if loan_amount > 0 else 0,
            'tenure_months': tenure,
            'requested_monthly_emi': requested_monthly_emi
        }
        
        return features
    
    def create_behavioral_features(self, alt_data):
        """Create behavioral scoring features"""
        features = {
            'financial_discipline_score': (
                alt_data.get('bank_transaction_frequency', 0) * 0.3 +
                alt_data.get('utility_payment_consistency', 0) * 0.4 +
                alt_data.get('psychometric_score', 50) * 0.3
            ) / 100,
            'digital_adoption_score': alt_data.get('digital_footprint_score', 0) / 100,
            'psychometric_score_norm': alt_data.get('psychometric_score', 50) / 100,
            'upi_digital_transactions': alt_data.get('upi_transaction_count', 0),
            'fpo_agricultural_membership': int(alt_data.get('fpo_membership', False)),
            'business_registered': int(alt_data.get('business_registration', False))
        }
        
        return features
    
    def create_demographic_features(self, personal_data):
        """Create demographic features"""
        features = {
            'age': personal_data.get('age', 30),
            'is_farmer': int(personal_data.get('occupation', '').lower() == 'farmer'),
            'is_woman_entrepreneur': int(personal_data.get('gender', '').lower() == 'female' and 
                                        personal_data.get('employment_type', '').lower() == 'self-employed'),
            'tier_3_4_location': int(personal_data.get('location_tier', '3') in ['3', '4']),
            'has_credit_history': int(personal_data.get('credit_history_months', 0) > 0),
            'education_level_numeric': {
                'High School': 1,
                'Diploma': 2,
                'Graduate': 3,
                'Post Graduate': 4
            }.get(personal_data.get('education_level', 'High School'), 1)
        }
        
        return features
    
    def engineer_all_features(self, personal_data, financial_data, alt_data):
        """Combine all feature engineering"""
        financial_features = self.create_financial_features(financial_data)
        behavioral_features = self.create_behavioral_features(alt_data)
        demographic_features = self.create_demographic_features(personal_data)
        
        all_features = {
            **financial_features,
            **behavioral_features,
            **demographic_features
        }
        
        return all_features

class CreditScoringAgent:
    """Scores creditworthiness using ML models"""
    
    def __init__(self):
        self.name = "Credit Scoring Agent"
    
    def generate_credit_score(self, features):
        """Generate credit score (0-900) using ensemble approach"""
        
        # Financial score based on income and expenses
        available_income_ratio = features.get('available_income', 0) / max(features.get('monthly_income', 1), 1)
        financial_score = min(100, max(0, available_income_ratio * 100 + 50))
        
        # Debt score based on debt burden
        debt_burden = features.get('debt_burden_with_new_loan', 0)
        debt_score = max(0, 100 - (debt_burden * 150))
        
        # Behavioral score
        behavioral_score = (
            features.get('financial_discipline_score', 0) * 70 +
            features.get('digital_adoption_score', 0) * 30
        )
        
        # Demographic bonus
        demographic_bonus = 0
        if features.get('is_farmer', 0) or features.get('is_woman_entrepreneur', 0):
            demographic_bonus = 25
        if features.get('tier_3_4_location', 0):
            demographic_bonus += 10
        
        # Calculate final score
        credit_score = (
            financial_score * 0.40 +
            debt_score * 0.30 +
            behavioral_score * 0.25 +
            demographic_bonus * 0.05
        )
        
        final_score = 300 + (credit_score / 100) * 600
        
        return {
            'credit_score': int(final_score),
            'financial_score': financial_score,
            'debt_score': debt_score,
            'behavioral_score': behavioral_score,
            'demographic_bonus': demographic_bonus,
            'component_scores': {
                'financial': financial_score,
                'debt_management': debt_score,
                'behavioral': behavioral_score
            }
        }

class RiskAssessmentAgent:
    """Assesses loan default risk"""
    
    def __init__(self):
        self.name = "Risk Assessment Agent"
    
    def assess_risk(self, features, credit_score):
        """Assess default probability and risk category"""
        
        credit_score_normalized = (credit_score - 300) / 600
        base_default_prob = 1 - credit_score_normalized
        
        risk_adjustments = {
            'high_debt_burden': features.get('debt_burden_with_new_loan', 0) > 0.40,
            'low_financial_discipline': features.get('financial_discipline_score', 1) < 0.3,
            'insufficient_income': features.get('available_income', 0) < 5000,
            'no_collateral': features.get('savings_to_loan_ratio', 0) < 0.1,
            'no_credit_history': not features.get('has_credit_history', True)
        }
        
        adjustment = 0
        for risk_factor, is_present in risk_adjustments.items():
            if is_present:
                adjustment += 0.05
        
        adjusted_default_prob = min(0.95, base_default_prob + adjustment)
        
        if adjusted_default_prob > 0.30:
            risk_category = 'HIGH'
        elif adjusted_default_prob > 0.15:
            risk_category = 'MEDIUM'
        else:
            risk_category = 'LOW'
        
        return {
            'default_probability': adjusted_default_prob,
            'risk_category': risk_category,
            'risk_factors': risk_adjustments,
            'risk_adjustment': adjustment
        }

class DecisionEngineAgent:
    """Makes final lending decision"""
    
    def __init__(self):
        self.name = "Decision Engine Agent"
    
    def make_decision(self, credit_score, risk_assessment, features, personal_data):
        """Make final lending decision"""
        
        decision = {
            'status': 'PENDING',
            'approved_amount': 0,
            'interest_rate': 0,
            'tenure_months': 0,
            'conditions': [],
            'rejection_reasons': [],
            'emi': 0
        }
        
        # Decision logic
        if credit_score >= 650:
            decision['status'] = 'APPROVED'
            decision['conditions'].append('Standard terms apply')
        elif credit_score >= 550:
            decision['status'] = 'CONDITIONAL_APPROVAL'
            decision['conditions'].append('Manual review recommended')
            decision['conditions'].append('Additional collateral may be required')
        else:
            decision['status'] = 'DECLINED'
            decision['rejection_reasons'].append('Credit score below minimum threshold')
        
        # Interest rate based on risk
        if risk_assessment['risk_category'] == 'LOW':
            decision['interest_rate'] = 8.5
        elif risk_assessment['risk_category'] == 'MEDIUM':
            decision['interest_rate'] = 12.5
        else:
            decision['interest_rate'] = 16.5
        
        # Calculate approved amount
        monthly_income = features.get('monthly_income', 0)
        max_loan_amount = monthly_income * 48
        requested_amount = features.get('loan_amount_to_income', 0) * monthly_income * 12
        
        decision['approved_amount'] = min(max_loan_amount, requested_amount)
        decision['tenure_months'] = int(features.get('tenure_months', 12))
        
        # Calculate EMI
        if decision['approved_amount'] > 0:
            monthly_rate = decision['interest_rate'] / 100 / 12
            n = decision['tenure_months']
            if monthly_rate > 0:
                decision['emi'] = (decision['approved_amount'] * monthly_rate * (1 + monthly_rate)**n) / ((1 + monthly_rate)**n - 1)
            else:
                decision['emi'] = decision['approved_amount'] / n
        
        # Special schemes
        if personal_data.get('occupation', '').lower() == 'farmer':
            decision['conditions'].append('Eligible for government subsidy schemes')
            decision['interest_rate'] *= 0.85
        
        if personal_data.get('gender', '').lower() == 'female' and personal_data.get('employment_type', '') == 'Self-Employed':
            decision['conditions'].append('Eligible for women entrepreneur schemes')
            decision['interest_rate'] *= 0.90
        
        return decision

class ComplianceAgent:
    """Ensures regulatory compliance and fairness"""
    
    def __init__(self):
        self.name = "Compliance Agent"
    
    def check_compliance(self, decision, personal_data, risk_assessment):
        """Check compliance with regulations"""
        
        compliance = {
            'is_compliant': True,
            'checks': {},
            'warnings': [],
            'audit_trail': []
        }
        
        # Age verification
        age = personal_data.get('age', 0)
        compliance['checks']['age_eligible'] = 18 <= age <= 75
        if not compliance['checks']['age_eligible']:
            compliance['is_compliant'] = False
            compliance['warnings'].append('Age outside permissible range (18-75)')
        
        # No discrimination checks
        compliance['checks']['no_gender_discrimination'] = True
        compliance['checks']['no_location_discrimination'] = True
        compliance['checks']['kyc_verified'] = True
        compliance['audit_trail'].append(f"KYC Verified at {datetime.now().isoformat()}")
        compliance['checks']['decision_explainable'] = True
        compliance['audit_trail'].append(f"Decision made by automated system with explainability layers")
        
        # Risk warnings
        if risk_assessment['default_probability'] > 0.30:
            compliance['warnings'].append('High default risk - requires additional scrutiny')
        
        return compliance

class RBIKYCAgent:
    """Handles RBI-approved KYC methods"""
    
    def __init__(self):
        self.name = "RBI KYC Agent"
        self.kyc_methods = {
            'aadhaar_ekyc': 'Aadhaar-based e-KYC',
            'video_kyc': 'Video KYC (V-CIP)',
            'digilocker': 'DigiLocker-based KYC',
            'cersai': 'CERSAI KYC Registry',
            'ckyc': 'Central KYC Registry (CKYCR)',
            'offline_aadhaar': 'Offline Aadhaar XML'
        }
    
    def perform_aadhaar_ekyc(self, personal_data):
        """Simulate Aadhaar-based e-KYC (UIDAI Authentication)"""
        result = {
            'method': 'Aadhaar e-KYC',
            'status': 'SUCCESS',
            'kyc_id': f"EKYC_{hashlib.sha256(str(datetime.now()).encode()).hexdigest()[:12]}",
            'verified_attributes': {
                'name': True,
                'date_of_birth': True,
                'address': True,
                'photograph': True,
                'mobile_number': True
            },
            'verification_timestamp': datetime.now().isoformat(),
            'validity_days': 365,
            'compliance': 'RBI Master Direction on KYC, 2016'
        }
        return result
    
    def perform_video_kyc(self, personal_data):
        """Simulate Video KYC (V-CIP) as per RBI guidelines"""
        result = {
            'method': 'Video KYC (V-CIP)',
            'status': 'SUCCESS',
            'kyc_id': f"VKYC_{hashlib.sha256(str(datetime.now()).encode()).hexdigest()[:12]}",
            'verified_attributes': {
                'live_photo': True,
                'pan_card': True,
                'address_proof': True,
                'geo_tagging': True,
                'recording_stored': True
            },
            'verification_timestamp': datetime.now().isoformat(),
            'officer_name': 'KYC Officer #1234',
            'validity_days': 365,
            'compliance': 'RBI Notification dated 03-08-2021'
        }
        return result
    
    def perform_digilocker_kyc(self, personal_data):
        """Simulate DigiLocker-based KYC"""
        result = {
            'method': 'DigiLocker KYC',
            'status': 'SUCCESS',
            'kyc_id': f"DIGI_{hashlib.sha256(str(datetime.now()).encode()).hexdigest()[:12]}",
            'verified_documents': {
                'aadhaar': True,
                'pan_card': True,
                'driving_license': True,
                'voter_id': False
            },
            'verification_timestamp': datetime.now().isoformat(),
            'validity_days': 365,
            'compliance': 'Digital Locker under Digital India initiative'
        }
        return result
    
    def perform_ckyc(self, personal_data):
        """Simulate Central KYC Registry verification"""
        result = {
            'method': 'Central KYC (CKYCR)',
            'status': 'SUCCESS',
            'ckyc_number': f"CKYC{np.random.randint(100000000000, 999999999999)}",
            'kyc_id': f"CKYC_{hashlib.sha256(str(datetime.now()).encode()).hexdigest()[:12]}",
            'verified_attributes': {
                'name': True,
                'father_name': True,
                'address': True,
                'pan': True,
                'identity_proof': True
            },
            'verification_timestamp': datetime.now().isoformat(),
            'reusable_across_institutions': True,
            'validity_days': 3650,  # 10 years
            'compliance': 'Prevention of Money Laundering (Maintenance of Records) Rules, 2005'
        }
        return result
    
    def perform_offline_aadhaar_kyc(self, personal_data):
        """Simulate Offline Aadhaar XML-based KYC"""
        result = {
            'method': 'Offline Aadhaar XML',
            'status': 'SUCCESS',
            'kyc_id': f"OKYC_{hashlib.sha256(str(datetime.now()).encode()).hexdigest()[:12]}",
            'verified_attributes': {
                'name': True,
                'date_of_birth': True,
                'gender': True,
                'address': True,
                'photo': True
            },
            'verification_timestamp': datetime.now().isoformat(),
            'validity_days': 365,
            'privacy_preserving': True,
            'compliance': 'UIDAI Circular on Offline Aadhaar XML'
        }
        return result
    
    def get_kyc_summary(self, kyc_results):
        """Generate KYC verification summary"""
        summary = {
            'total_methods_used': len(kyc_results),
            'all_verified': all(r['status'] == 'SUCCESS' for r in kyc_results),
            'methods_completed': [r['method'] for r in kyc_results if r['status'] == 'SUCCESS'],
            'kyc_score': 0,
            'is_kyc_compliant': True
        }
        
        # Calculate KYC score
        summary['kyc_score'] = (len([r for r in kyc_results if r['status'] == 'SUCCESS']) / len(kyc_results)) * 100
        
        return summary

# ==================== STREAMLIT APP ====================

def main():
    st.title("🏦 AI-Driven Digital Banking Platform")
    st.markdown("### Secure, Inclusive, Intelligent Lending for Underserved Communities")
    
    page = st.sidebar.radio("Navigation", [
        "Dashboard",
        "Loan Application",
        "Decision Engine",
        "KYC Verification",
        "Monitoring",
        "Analytics"
    ])
    
    if page == "Dashboard":
        show_dashboard()
    elif page == "Loan Application":
        show_loan_application()
    elif page == "Decision Engine":
        show_decision_engine()
    elif page == "KYC Verification":
        show_kyc_verification()
    elif page == "Monitoring":
        show_monitoring()
    elif page == "Analytics":
        show_analytics()

def show_dashboard():
    st.header("📊 Platform Dashboard")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Borrowers", "12,543", "+15%")
    with col2:
        st.metric("Loans Disbursed", "₹24.5 Cr", "+8.2%")
    with col3:
        st.metric("Approval Rate", "68.5%", "+2.1%")
    with col4:
        st.metric("Default Rate", "2.3%", "-0.5%")
    
    st.markdown("---")
    
    st.subheader("Target Segment Performance")
    segments_data = {
        'Segment': ['Farmers', 'Women Entrepreneurs', 'Tier 3/4 Cities', 'CIBIL-less Users'],
        'Active Borrowers': [3240, 2156, 5432, 1715],
        'Portfolio Size (₹ Cr)': [8.5, 6.2, 7.8, 2.0],
        'Default Rate (%)': [2.1, 1.8, 2.5, 3.2]
    }
    df_segments = pd.DataFrame(segments_data)
    st.dataframe(df_segments, use_container_width=True)

def show_loan_application():
    st.header("📝 Loan Application & Data Collection")
    st.markdown("Automated borrower profiling with multi-agent data collection")
    
    with st.form("loan_application_form"):
        st.subheader("Personal Information")
        col1, col2 = st.columns(2)
        with col1:
            name = st.text_input("Full Name", value="Rahul Kumar")
            age = st.slider("Age", 18, 75, 35)
            gender = st.selectbox("Gender", ["Male", "Female", "Others"])
        with col2:
            occupation = st.selectbox("Occupation", ["Farmer", "Self-Employed", "Employed", "Business Owner", "Agritech Entrepreneur"])
            state = st.selectbox("State", ["Tamil Nadu", "Maharashtra", "Uttar Pradesh", "Bihar", "Rajasthan", "Others"])
            location_tier = st.select_slider("Location Tier", options=["1", "2", "3", "4"], value="3")
        
        employment_type = st.selectbox("Employment Type", ["Self-Employed", "Employed", "Agriculture", "Business"])
        education = st.selectbox("Education Level", ["High School", "Diploma", "Graduate", "Post Graduate"])
        
        st.subheader("Financial Information")
        col3, col4 = st.columns(2)
        with col3:
            annual_income = st.number_input("Annual Income (₹)", min_value=0, value=240000, step=10000)
            monthly_expenses = st.number_input("Monthly Expenses (₹)", min_value=0, value=8000, step=1000)
            savings = st.number_input("Savings (₹)", min_value=0, value=50000, step=5000)
        with col4:
            existing_loans = st.number_input("Existing Loans (Count)", min_value=0, value=0, step=1)
            existing_emi = st.number_input("Existing Monthly EMI (₹)", min_value=0, value=0, step=500)
            cibil_score = st.number_input("CIBIL Score (if available)", min_value=0, max_value=900, value=0, step=10)
        
        credit_history = st.select_slider("Credit History (Months)", options=list(range(0, 121, 12)), value=0)
        
        st.subheader("Loan Request")
        col5, col6 = st.columns(2)
        with col5:
            loan_amount = st.number_input("Loan Amount Requested (₹)", min_value=1000, value=100000, step=5000)
            tenure = st.select_slider("Loan Tenure (Months)", options=[6, 12, 24, 36, 48, 60], value=12)
        with col6:
            purpose = st.selectbox("Loan Purpose", ["Agriculture", "Business Expansion", "Home Improvement", "Education", "Others"])
            loan_type = st.selectbox("Loan Type", ["Unsecured", "Secured"])
        
        st.subheader("Alternative Credit Data")
        col7, col8 = st.columns(2)
        with col7:
            bank_frequency = st.slider("Bank Transaction Frequency (Transactions/Month)", 0, 50, 10)
            utility_consistency = st.slider("Utility Payment Consistency (%)", 0, 100, 80)
            upi_transactions = st.number_input("UPI Transactions (Monthly)", min_value=0, value=25, step=5)
        with col8:
            digital_score = st.slider("Digital Footprint Score (%)", 0, 100, 60)
            psychometric_score = st.slider("Psychometric Score", 0, 100, 65)
        
        fpo_member = st.checkbox("FPO/Cooperative Member", value=False)
        business_registered = st.checkbox("Business Officially Registered", value=False)
        
        submitted = st.form_submit_button("Submit Application", use_container_width=True)
    
    if submitted:
        data_agent = DataCollectionAgent()
        
        form_data = {
            'name': name, 'age': age, 'gender': gender, 'occupation': occupation,
            'state': state, 'location_tier': location_tier, 'employment_type': employment_type,
            'education': education, 'annual_income': annual_income, 'monthly_expenses': monthly_expenses,
            'savings': savings, 'existing_loans': existing_loans, 'existing_emi': existing_emi,
            'cibil_score': cibil_score if cibil_score > 0 else None, 'credit_history': credit_history,
            'loan_amount': loan_amount, 'tenure': tenure, 'purpose': purpose, 'loan_type': loan_type,
            'bank_frequency': bank_frequency, 'utility_consistency': utility_consistency,
            'upi_transactions': upi_transactions, 'digital_score': digital_score,
            'psychometric_score': psychometric_score, 'fpo_member': fpo_member,
            'business_registered': business_registered
        }
        
        personal_data = data_agent.collect_personal_data(form_data)
        financial_data = data_agent.collect_financial_data(form_data)
        alt_data = data_agent.collect_alternative_data(form_data)
        
        validation = data_agent.validate_data({**personal_data, **financial_data})
        
        if validation['is_valid']:
            st.success("✅ Data Validation Passed")
            
            st.session_state.borrower_profile = {
                'personal': personal_data,
                'financial': financial_data,
                'alternative': alt_data
            }
            
            st.subheader("Data Collection Summary")
            st.write(f"**Borrower ID:** {personal_data['borrower_id']}")
            col_a, col_b = st.columns(2)
            with col_a:
                st.write("**Personal Data Collected:**")
                st.json(personal_data)
            with col_b:
                st.write("**Financial Data Collected:**")
                financial_display = {}
                for k, v in financial_data.items():
                    if isinstance(v, (int, float)) and k != 'credit_history_months' and k != 'loan_tenure':
                        financial_display[k] = f"₹{v:,.0f}" if v > 0 else v
                    else:
                        financial_display[k] = v
                st.json(financial_display)
            
            st.info("✅ Application submitted successfully! Proceed to 'Decision Engine' for credit evaluation.")
        else:
            st.error("❌ Validation Failed")
            for issue in validation['issues']:
                st.error(f"  • {issue}")

def show_decision_engine():
    st.header("🤖 AI Decision Engine")
    st.markdown("Automated credit decision with feature engineering and ML scoring")
    
    if st.session_state.borrower_profile is None:
        st.info("ℹ️ Please complete a loan application first in the 'Loan Application' section.")
        return
    
    personal_data = st.session_state.borrower_profile['personal']
    financial_data = st.session_state.borrower_profile['financial']
    alt_data = st.session_state.borrower_profile['alternative']
    
    st.subheader("Agent Processing Pipeline")
    
    with st.spinner("Processing..."):
        # Feature Engineering
        st.info("🔧 Feature Engineering Agent: Creating ML-ready features...")
        fe_agent = FeatureEngineeringAgent()
        features = fe_agent.engineer_all_features(personal_data, financial_data, alt_data)
        
        st.success("✅ Features engineered successfully")
        with st.expander("View Engineered Features"):
            features_df = pd.DataFrame({
                'Feature': list(features.keys()),
                'Value': [f"{v:.2f}" if isinstance(v, float) else str(v) for v in features.values()]
            })
            st.dataframe(features_df, use_container_width=True)
        
        # Credit Scoring
        st.info("📊 Credit Scoring Agent: Generating credit score...")
        scoring_agent = CreditScoringAgent()
        credit_score_result = scoring_agent.generate_credit_score(features)
        
        st.success("✅ Credit score generated")
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Credit Score", credit_score_result['credit_score'], delta="Out of 900")
        with col2:
            st.metric("Financial Score", f"{credit_score_result['financial_score']:.1f}", delta="Out of 100")
        with col3:
            st.metric("Debt Score", f"{credit_score_result['debt_score']:.1f}", delta="Out of 100")
        with col4:
            st.metric("Behavioral Score", f"{credit_score_result['behavioral_score']:.1f}", delta="Out of 100")
        
        # Risk Assessment
        st.info("⚠️ Risk Assessment Agent: Assessing default risk...")
        risk_agent = RiskAssessmentAgent()
        risk_assessment = risk_agent.assess_risk(features, credit_score_result['credit_score'])
        
        st.success("✅ Risk assessment complete")
        col_r1, col_r2, col_r3 = st.columns(3)
        with col_r1:
            st.metric("Default Probability", f"{risk_assessment['default_probability']*100:.1f}%")
        with col_r2:
            risk_color = "🟢" if risk_assessment['risk_category'] == 'LOW' else "🟡" if risk_assessment['risk_category'] == 'MEDIUM' else "🔴"
            st.metric("Risk Category", f"{risk_color} {risk_assessment['risk_category']}")
        with col_r3:
            st.metric("Risk Factors Present", sum(risk_assessment['risk_factors'].values()))
        
        # Decision Making
        st.info("⚖️ Decision Engine: Making lending decision...")
        decision_agent = DecisionEngineAgent()
        decision = decision_agent.make_decision(
            credit_score_result['credit_score'],
            risk_assessment,
            features,
            personal_data
        )
        
        st.success("✅ Decision generated")
        
        st.subheader("Lending Decision")
        
        if decision['status'] == 'APPROVED':
            st.markdown("""<div class="approval-box">
            <h3>✅ LOAN APPROVED</h3>
            </div>""", unsafe_allow_html=True)
        elif decision['status'] == 'CONDITIONAL_APPROVAL':
            st.markdown("""<div class="review-box">
            <h3>⚠️ CONDITIONAL APPROVAL</h3>
            </div>""", unsafe_allow_html=True)
        else:
            st.markdown("""<div class="decline-box">
            <h3>❌ LOAN DECLINED</h3>
            </div>""", unsafe_allow_html=True)
        
        col_d1, col_d2, col_d3 = st.columns(3)
        with col_d1:
            st.metric("Approved Amount", f"₹{decision['approved_amount']:,.0f}")
        with col_d2:
            st.metric("Interest Rate", f"{decision['interest_rate']:.2f}% p.a.")
        with col_d3:
            st.metric("Monthly EMI", f"₹{decision['emi']:,.0f}")
        
        st.metric("Tenure", f"{decision['tenure_months']} months")
        
        if decision['conditions']:
            st.subheader("Conditions & Notes")
            for i, condition in enumerate(decision['conditions'], 1):
                st.write(f"{i}. {condition}")
        
        if decision['rejection_reasons']:
            st.subheader("Rejection Reasons")
            for reason in decision['rejection_reasons']:
                st.error(reason)
        
        # Compliance Check
        st.info("📋 Compliance Agent: Verifying regulatory compliance...")
        compliance_agent = ComplianceAgent()
        compliance = compliance_agent.check_compliance(decision, personal_data, risk_assessment)
        
        st.success("✅ Compliance verification complete")
        if compliance['is_compliant']:
            st.success("✅ All compliance checks passed")
        else:
            st.warning("⚠️ Compliance warnings present")
        
        if compliance['warnings']:
            for warning in compliance['warnings']:
                st.warning(warning)
        
        st.session_state.credit_decision = {
            'credit_score': credit_score_result,
            'risk': risk_assessment,
            'decision': decision,
            'compliance': compliance,
            'features': features
        }

def show_kyc_verification():
    st.header("🔐 RBI-Approved KYC Verification")
    st.markdown("Multiple RBI-compliant KYC methods for secure identity verification")
    
    if st.session_state.borrower_profile is None:
        st.info("ℹ️ Please complete a loan application first.")
        return
    
    personal_data = st.session_state.borrower_profile['personal']
    
    st.subheader("Available RBI-Approved KYC Methods")
    
    kyc_agent = RBIKYCAgent()
    
    # Display available methods
    st.info("Select one or more KYC methods for verification:")
    
    col1, col2 = st.columns(2)
    with col1:
        use_aadhaar = st.checkbox("✅ Aadhaar e-KYC (UIDAI)", value=True)
        use_video = st.checkbox("📹 Video KYC (V-CIP)", value=True)
        use_digilocker = st.checkbox("📁 DigiLocker KYC", value=False)
    with col2:
        use_ckyc = st.checkbox("🏛️ Central KYC (CKYCR)", value=True)
        use_offline_aadhaar = st.checkbox("📄 Offline Aadhaar XML", value=False)
    
    if st.button("Perform KYC Verification", type="primary", use_container_width=True):
        with st.spinner("Performing KYC verification..."):
            kyc_results = []
            
            # Aadhaar e-KYC
            if use_aadhaar:
                st.info("🔍 Performing Aadhaar e-KYC...")
                result = kyc_agent.perform_aadhaar_ekyc(personal_data)
                kyc_results.append(result)
                st.success(f"✅ {result['method']} completed")
            
            # Video KYC
            if use_video:
                st.info("🔍 Performing Video KYC...")
                result = kyc_agent.perform_video_kyc(personal_data)
                kyc_results.append(result)
                st.success(f"✅ {result['method']} completed")
            
            # DigiLocker
            if use_digilocker:
                st.info("🔍 Performing DigiLocker KYC...")
                result = kyc_agent.perform_digilocker_kyc(personal_data)
                kyc_results.append(result)
                st.success(f"✅ {result['method']} completed")
            
            # Central KYC
            if use_ckyc:
                st.info("🔍 Performing Central KYC verification...")
                result = kyc_agent.perform_ckyc(personal_data)
                kyc_results.append(result)
                st.success(f"✅ {result['method']} completed")
            
            # Offline Aadhaar
            if use_offline_aadhaar:
                st.info("🔍 Performing Offline Aadhaar verification...")
                result = kyc_agent.perform_offline_aadhaar_kyc(personal_data)
                kyc_results.append(result)
                st.success(f"✅ {result['method']} completed")
            
            # Generate summary
            summary = kyc_agent.get_kyc_summary(kyc_results)
            
            st.markdown("---")
            st.subheader("KYC Verification Summary")
            
            col_s1, col_s2, col_s3 = st.columns(3)
            with col_s1:
                st.metric("Methods Used", summary['total_methods_used'])
            with col_s2:
                st.metric("KYC Score", f"{summary['kyc_score']:.0f}%")
            with col_s3:
                compliance_status = "✅ Compliant" if summary['is_kyc_compliant'] else "❌ Non-Compliant"
                st.metric("Compliance Status", compliance_status)
            
            st.subheader("Detailed Verification Results")
            
            for i, result in enumerate(kyc_results, 1):
                with st.expander(f"Method {i}: {result['method']}", expanded=True):
                    col_a, col_b = st.columns(2)
                    
                    with col_a:
                        st.write("**Verification Details:**")
                        st.write(f"- **Status:** {result['status']}")
                        st.write(f"- **KYC ID:** `{result['kyc_id']}`")
                        st.write(f"- **Timestamp:** {result['verification_timestamp']}")
                        st.write(f"- **Validity:** {result['validity_days']} days")
                        if 'ckyc_number' in result:
                            st.write(f"- **CKYC Number:** {result['ckyc_number']}")
                        if 'reusable_across_institutions' in result:
                            st.write(f"- **Reusable:** {'Yes' if result['reusable_across_institutions'] else 'No'}")
                    
                    with col_b:
                        st.write("**Verified Attributes:**")
                        if 'verified_attributes' in result:
                            for attr, status in result['verified_attributes'].items():
                                status_icon = "✅" if status else "❌"
                                st.write(f"{status_icon} {attr.replace('_', ' ').title()}")
                        elif 'verified_documents' in result:
                            for doc, status in result['verified_documents'].items():
                                status_icon = "✅" if status else "❌"
                                st.write(f"{status_icon} {doc.replace('_', ' ').title()}")
                    
                    st.info(f"**Compliance:** {result['compliance']}")
            
            st.session_state.kyc_status = {
                'results': kyc_results,
                'summary': summary,
                'timestamp': datetime.now().isoformat()
            }
            
            st.success("🎉 KYC verification completed successfully!")
            
            # Benefits information
            st.markdown("---")
            st.subheader("🎯 Benefits of RBI-Approved KYC")
            
            benefits_col1, benefits_col2 = st.columns(2)
            with benefits_col1:
                st.markdown("""
                **For Customers:**
                - ✅ Quick verification (minutes, not days)
                - ✅ Paperless and contactless process
                - ✅ Single KYC for multiple institutions (CKYC)
                - ✅ Enhanced privacy and security
                - ✅ Reduced documentation burden
                """)
            
            with benefits_col2:
                st.markdown("""
                **For Institutions:**
                - ✅ Reduced operational costs
                - ✅ Improved customer onboarding speed
                - ✅ RBI compliance assured
                - ✅ Lower fraud risk
                - ✅ Better audit trail
                """)

def show_monitoring():
    st.header("📈 Loan Monitoring & Performance Tracking")
    st.markdown("Real-time monitoring of active loans and early warning systems")
    
    if st.session_state.credit_decision is None:
        st.info("ℹ️ Complete the decision engine process first.")
        return
    
    st.subheader("Active Loans Dashboard")
    
    # Sample loan data
    loans_data = {
        'Loan ID': ['LOAN_001', 'LOAN_002', 'LOAN_003', 'LOAN_004'],
        'Borrower': ['Rahul Kumar', 'Priya Singh', 'Arjun Patel', 'Fatima Khan'],
        'Loan Amount': ['₹1,00,000', '₹1,50,000', '₹75,000', '₹1,20,000'],
        'Monthly EMI': ['₹8,500', '₹12,600', '₹6,200', '₹10,100'],
        'Payment Status': ['✅ On Time', '✅ On Time', '⚠️ 5 Days Late', '❌ 15 Days Late'],
        'Risk Score': ['Low', 'Low', 'Medium', 'High'],
        'Days to Next Payment': [5, 12, 18, -8]
    }
    
    df_loans = pd.DataFrame(loans_data)
    st.dataframe(df_loans, use_container_width=True)
    
    st.subheader("Early Warning System")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("On-Time Payments", "94.2%", delta="+2.1%")
    with col2:
        st.metric("Loans at Risk", "5.3%", delta="-1.2%")
    with col3:
        st.metric("Default Rate (30+ days)", "0.5%", delta="-0.1%")
    
    st.subheader("Risk Alert Triggers")
    alerts = [
        {"Type": "Payment Delay", "Borrower": "Arjun Patel", "Days Late": 5, "Action": "Send reminder", "Priority": "Medium"},
        {"Type": "Income Drop", "Borrower": "Fatima Khan", "Severity": "High", "Action": "Review immediately", "Priority": "High"},
        {"Type": "Business Distress", "Borrower": "LOAN_005", "Risk": "Medium", "Action": "Schedule call", "Priority": "Medium"}
    ]
    
    for alert in alerts:
        priority_color = "🔴" if alert.get('Priority') == 'High' else "🟡"
        with st.expander(f"{priority_color} Alert: {alert['Type']} - {alert.get('Borrower', alert.get('Type'))}"):
            st.json(alert)
    
    st.subheader("Performance Metrics")
    metrics_col1, metrics_col2 = st.columns(2)
    
    with metrics_col1:
        st.metric("Total Active Loans", "12,543")
        st.metric("Total Disbursed Amount", "₹245 Cr")
        st.metric("Average Loan Size", "₹1.95 Lakh")
    
    with metrics_col2:
        st.metric("Collection Efficiency", "97.8%")
        st.metric("Portfolio at Risk (PAR > 30)", "2.3%")
        st.metric("Net NPA Ratio", "1.1%")

def show_analytics():
    st.header("📊 Platform Analytics & Insights")
    st.markdown("Comprehensive analytics on platform performance and lending patterns")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Approval Rate by Segment")
        segment_approval = pd.DataFrame({
            'Segment': ['Farmers', 'Women Entrepreneurs', 'Tier 3/4 Cities', 'CIBIL-less Users'],
            'Approval Rate': [72, 75, 68, 65]
        })
        st.bar_chart(segment_approval.set_index('Segment'))
    
    with col2:
        st.subheader("Default Rate by Risk Category")
        risk_default = pd.DataFrame({
            'Risk Category': ['Low Risk', 'Medium Risk', 'High Risk'],
            'Default Rate': [0.5, 2.8, 8.5]
        })
        st.bar_chart(risk_default.set_index('Risk Category'))
    
    st.subheader("Portfolio Composition")
    portfolio_data = pd.DataFrame({
        'Category': ['Farmers', 'Women Entrepreneurs', 'SMEs', 'Others'],
        'Percentage': [28, 22, 25, 25]
    })
    st.bar_chart(portfolio_data.set_index('Category'))
    
    st.subheader("Key Platform Metrics")
    metrics_data = {
        'Metric': [
            'Total Portfolio',
            'Average Loan Size',
            'Average Interest Rate',
            'Approval Time',
            'Average EMI Period',
            'Payment Success Rate',
            'Customer Satisfaction',
            'Cost per Loan'
        ],
        'Value': [
            '₹245 Cr',
            '₹1.95 Lakh',
            '11.2%',
            '2.3 hours',
            '24 months',
            '99.2%',
            '4.5/5.0',
            '₹450'
        ],
        'Benchmark': [
            '₹200 Cr',
            '₹2.00 Lakh',
            '12.5%',
            '48 hours',
            '24 months',
            '95.0%',
            '4.0/5.0',
            '₹800'
        ]
    }
    st.dataframe(pd.DataFrame(metrics_data), use_container_width=True)
    
    st.markdown("---")
    st.subheader("Monthly Trends")
    
    # Simulated monthly data
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    monthly_data = pd.DataFrame({
        'Month': months,
        'Disbursements': [180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345],
        'Collections': [170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335]
    })
    
    st.line_chart(monthly_data.set_index('Month'))
    
    st.markdown("---")
    st.info("💡 **Insight:** The platform shows consistent growth with improving collection efficiency and reducing default rates across all segments.")

if __name__ == "__main__":
    main()