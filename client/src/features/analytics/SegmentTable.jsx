import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, Badge, Select, Alert } from '../../components/common/Index'; // ✅ Updated
import { TrendingUp, TrendingDown, ChevronDown, Download, Share2 } from 'lucide-react'; // ✅ Added

// ✅ Mock data import
import { getAllSegments } from '../../data/Index'; // ✅ Added

/**
 * SegmentTable Component
 * Displays detailed segment-wise performance metrics with expandable rows
 * 
 * @param {array} customSegments - Custom segment data (optional)
 * @param {string} sortBy - Initial sort field
 * @param {boolean} expandAll - Expand all rows on load
 * @param {function} onSegmentClick - Segment click handler
 * @param {boolean} exportable - Enable export functionality
 * @param {function} onExport - Export callback
 * @param {boolean} shareable - Enable share functionality
 */
const SegmentTable = ({ 
  customSegments = null, // ✅ Added
  sortBy: initialSort = 'borrowers', // ✅ Added
  expandAll = false, // ✅ Added
  onSegmentClick = null, // ✅ Added
  exportable = true, // ✅ Added
  onExport = null, // ✅ Added
  shareable = true, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [expandedRow, setExpandedRow] = useState(expandAll ? 'all' : null); // ✅ Updated
  const [sortBy, setSortBy] = useState(initialSort); // ✅ Updated
  const [searchTerm, setSearchTerm] = useState(''); // ✅ Added

  // ✅ Get segment data from mock or use custom
  const segmentData = useMemo(() => {
    if (customSegments) {
      return customSegments;
    }
    return getAllSegments();
  }, [customSegments]);

  // ✅ Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = segmentData.filter(segment =>
      segment.segment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ Sort logic
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'borrowers':
          return b.borrowers - a.borrowers;
        case 'portfolio':
          return b.portfolioSize - a.portfolioSize;
        case 'default':
          return a.defaultRate - b.defaultRate;
        case 'growth':
          return b.monthlyGrowth - a.monthlyGrowth;
        default:
          return 0;
      }
    });
  }, [segmentData, sortBy, searchTerm]);

  // ✅ Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalBorrowers = filteredAndSortedData.reduce((sum, s) => sum + s.borrowers, 0);
    const totalPortfolio = filteredAndSortedData.reduce((sum, s) => sum + s.portfolioSize, 0);
    const avgDefaultRate = filteredAndSortedData.reduce((sum, s) => sum + s.defaultRate, 0) / filteredAndSortedData.length;
    const avgCollectionRate = filteredAndSortedData.reduce((sum, s) => sum + s.collectionRate, 0) / filteredAndSortedData.length;
    const avgApprovalRate = filteredAndSortedData.reduce((sum, s) => sum + s.approvalRate, 0) / filteredAndSortedData.length;

    return {
      totalBorrowers,
      totalPortfolio,
      avgDefaultRate,
      avgCollectionRate,
      avgApprovalRate,
    };
  }, [filteredAndSortedData]);

  // ✅ Handle row expansion
  const toggleRow = useCallback((segmentId) => {
    setExpandedRow(expandedRow === segmentId ? null : segmentId);
  }, [expandedRow]);

  // ✅ Toggle expand all
  const toggleExpandAll = useCallback(() => {
    setExpandedRow(expandedRow === 'all' ? null : 'all');
  }, [expandedRow]);

  // ✅ Handle segment click
  const handleSegmentClick = useCallback((segment) => {
    if (onSegmentClick) {
      onSegmentClick(segment);
    } else if (banking?.selectSegment) {
      banking.selectSegment(segment);
    }
  }, [onSegmentClick, banking]);

  // ✅ Handle export
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(filteredAndSortedData);
    } else if (banking?.exportData) {
      banking.exportData({
        type: 'segments',
        data: filteredAndSortedData,
        timestamp: new Date(),
      });
    }
  }, [filteredAndSortedData, onExport, banking]);

  // ✅ Handle share
  const handleShare = useCallback(() => {
    const summary = `Segment Analysis Summary\n\nTotal Borrowers: ${summaryMetrics.totalBorrowers.toLocaleString()}\nTotal Portfolio: ₹${summaryMetrics.totalPortfolio.toFixed(1)}Cr\nAvg Default Rate: ${summaryMetrics.avgDefaultRate.toFixed(2)}%`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Segment-wise Performance',
        text: summary,
      });
    } else if (banking?.shareData) {
      banking.shareData(summary);
    }
  }, [summaryMetrics, banking]);

  // ✅ Calculate credit score rating
  const getCreditScoreRating = (score) => {
    if (score === 0) return 'No CIBIL';
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Very Good';
    if (score >= 650) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
  };

  // ✅ Calculate active loan percentage
  const getActiveLoanPercentage = (active, total) => {
    return ((active / total) * 100).toFixed(1);
  };

  // ✅ Check if row is expanded
  const isRowExpanded = (segmentId) => {
    return expandedRow === 'all' || expandedRow === segmentId;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Segment-wise Performance</h3>
          <p className="text-gray-600 mt-1">Detailed metrics by borrower segment</p>
        </div>

        {/* ✅ Action Buttons */}
        <div className="flex items-center gap-2">
          {exportable && (
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export data"
              aria-label="Export data"
            >
              <Download size={20} className="text-gray-600" />
            </button>
          )}

          {shareable && (
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Share data"
              aria-label="Share data"
            >
              <Share2 size={20} className="text-gray-600" />
            </button>
          )}

          {/* ✅ Sort Dropdown */}
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'borrowers', label: 'Sort by Borrowers' },
              { value: 'portfolio', label: 'Sort by Portfolio' },
              { value: 'default', label: 'Sort by Default Rate' },
              { value: 'growth', label: 'Sort by Growth' },
            ]}
          />
        </div>
      </div>

      {/* ✅ Search Box */}
      <div>
        <input
          type="text"
          placeholder="Search segments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Summary Row */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Borrowers</p>
            <p className="text-2xl font-bold text-gray-800">
              {summaryMetrics.totalBorrowers.toLocaleString()}
            </p>
            {/* ✅ Change percentage */}
            <p className="text-xs text-green-600 mt-1">↑ {((filteredAndSortedData.length > 0 ? (filteredAndSortedData[0].monthlyGrowth || 0) : 0)).toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Portfolio</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{summaryMetrics.totalPortfolio.toFixed(1)} Cr
            </p>
            <p className="text-xs text-gray-500 mt-1">{filteredAndSortedData.length} segments</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg Default Rate</p>
            <p className="text-2xl font-bold text-red-600">
              {summaryMetrics.avgDefaultRate.toFixed(2)}%
            </p>
            <p className="text-xs text-red-500 mt-1">⚠️ Monitor closely</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg Collection Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {summaryMetrics.avgCollectionRate.toFixed(2)}%
            </p>
            <p className="text-xs text-green-600 mt-1">✓ Healthy</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg Approval Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {summaryMetrics.avgApprovalRate.toFixed(2)}%
            </p>
            <p className="text-xs text-blue-600 mt-1">On track</p>
          </div>
        </div>
      </Card>

      {/* ✅ No Results Alert */}
      {filteredAndSortedData.length === 0 && (
        <Alert 
          type="info" 
          message={`No segments found matching "${searchTerm}"`}
          dismissible={false}
        />
      )}

      {/* Segment Table */}
      <Card title="Detailed Segment Analysis">
        {/* ✅ Expand All Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={toggleExpandAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {expandedRow === 'all' ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <div className="space-y-3">
          {filteredAndSortedData.map((segment) => (
            <div key={segment.id} className="border rounded-lg hover:shadow-md transition-shadow">
              {/* Main Row */}
              <div
                onClick={() => {
                  toggleRow(segment.id);
                  handleSegmentClick(segment);
                }}
                className="p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    toggleRow(segment.id);
                  }
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{segment.emoji || '📊'}</span>
                  <div>
                    <h4 className="font-bold text-gray-800">{segment.segment}</h4>
                    <p className="text-sm text-gray-600">
                      {segment.borrowers.toLocaleString()} borrowers • ₹{segment.portfolioSize} Cr portfolio
                    </p>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-6 gap-4 flex-1 text-center">
                  <div>
                    <p className="text-xs text-gray-600">Default Rate</p>
                    <p className={`font-bold ${segment.defaultRate > 3 ? 'text-red-600' : 'text-gray-800'}`}>
                      {segment.defaultRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Collection</p>
                    <p className="font-bold text-green-600">{segment.collectionRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Approval</p>
                    <p className="font-bold text-blue-600">{segment.approvalRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Avg Loan</p>
                    <p className="font-bold text-gray-800">₹{segment.avgLoanSize} L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Growth</p>
                    <p className={`font-bold ${segment.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {segment.trend === 'up' ? '+' : '-'}{segment.monthlyGrowth}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Risk</p>
                    <Badge
                      variant={
                        segment.riskLevel === 'Low' ? 'success' :
                        segment.riskLevel === 'Medium' ? 'warning' :
                        'danger'
                      }
                      size="sm"
                    >
                      {segment.riskLevel}
                    </Badge>
                  </div>
                </div>

                <button className="ml-4" aria-label={`Toggle details for ${segment.segment}`}>
                  <ChevronDown
                    size={20}
                    className={`text-gray-600 transition-transform ${
                      isRowExpanded(segment.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Expanded Content */}
              {isRowExpanded(segment.id) && (
                <div className="p-4 bg-white border-t space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Active Loans Card */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Active Loans</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {segment.activeLoans.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {getActiveLoanPercentage(segment.activeLoans, segment.borrowers)}% active
                      </p>
                    </div>

                    {/* Credit Score Card */}
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">Avg Credit Score</p>
                      <p className="text-2xl font-bold text-green-900">
                        {segment.avgCreditScore || 'N/A'}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {getCreditScoreRating(segment.avgCreditScore)}
                      </p>
                    </div>

                    {/* Growth Card */}
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600 mb-1">Monthly Growth</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {segment.monthlyGrowth}%
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        {segment.monthlyGrowth > 20 ? '🚀 Fastest' : 'Steady'}
                      </p>
                    </div>

                    {/* Avg Loan Size Card */}
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-600 mb-1">Avg Loan Size</p>
                      <p className="text-2xl font-bold text-orange-900">
                        ₹{segment.avgLoanSize} L
                      </p>
                      <p className="text-xs text-orange-600 mt-1">Per borrower</p>
                    </div>
                  </div>

                  {/* Top Products */}
                  {segment.topProducts && segment.topProducts.length > 0 && (
                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Top Products</h5>
                      <div className="flex flex-wrap gap-2">
                        {segment.topProducts.map((product, idx) => (
                          <Badge key={idx} variant="info" size="sm">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ✅ Segment Insights */}
                  <div className="border-t pt-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Segment Insights</h5>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        • Active loan rate: {getActiveLoanPercentage(segment.activeLoans, segment.borrowers)}%
                      </p>
                      <p>
                        • Average portfolio per borrower: ₹{(segment.portfolioSize * 10000000 / segment.borrowers / 100000).toFixed(2)} L
                      </p>
                      <p>
                        • Collection efficiency: {segment.collectionRate}% (vs avg {summaryMetrics.avgCollectionRate.toFixed(1)}%)
                      </p>
                      <p>
                        • Risk assessment: {segment.riskLevel} ({segment.defaultRate}% default)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ✅ Footer Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>Showing {filteredAndSortedData.length} of {segmentData.length} segments</p>
      </div>
    </div>
  );
};

export default SegmentTable;
