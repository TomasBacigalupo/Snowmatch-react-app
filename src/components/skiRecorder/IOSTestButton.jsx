/**
 * iOS Test Button Component
 * Allows testing SQLite functionality directly in the app
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  BugReport,
  CheckCircle,
  Error,
  Speed,
  Storage,
} from '@mui/icons-material';
import { testIOSSQLite, runFullIOSTest, diagnoseIOSSQLite } from '../../lib/test/ios-sqlite-test';

export const IOSTestButton = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [quickTestResult, setQuickTestResult] = useState(null);
  const [fullTestResult, setFullTestResult] = useState(null);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const runQuickTest = async () => {
    setIsRunning(true);
    setQuickTestResult(null);
    
    try {
      const result = await testIOSSQLite();
      setQuickTestResult(result);
    } catch (error) {
      console.error('Quick test error:', error);
      setQuickTestResult(false);
    } finally {
      setIsRunning(false);
    }
  };

  const runFullTest = async () => {
    setIsRunning(true);
    setFullTestResult(null);
    
    try {
      const result = await runFullIOSTest();
      setFullTestResult(result);
    } catch (error) {
      console.error('Full test error:', error);
      setFullTestResult({
        success: false,
        results: {
          databaseInit: false,
          activityCreation: false,
          batchSampleInsert: false,
          dataRetrieval: false,
          performance: {
            sampleInsertTime: 0,
            queryTime: 0,
            totalTime: 0,
          },
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResult(null);
    
    try {
      const result = await diagnoseIOSSQLite();
      setDiagnosticResult(result);
    } catch (error) {
      console.error('Diagnostic error:', error);
      setDiagnosticResult({
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getQuickTestIcon = () => {
    if (quickTestResult === null) return <BugReport />;
    return quickTestResult ? <CheckCircle color="success" /> : <Error color="error" />;
  };

  const getQuickTestColor = () => {
    if (quickTestResult === null) return 'primary';
    return quickTestResult ? 'success' : 'error';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
          <BugReport />
          iOS SQLite Test
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Test SQLite functionality on iOS device to ensure proper operation
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
          <Button
            variant="outlined"
            startIcon={isRunning ? <CircularProgress size={20} /> : getQuickTestIcon()}
            onClick={runQuickTest}
            disabled={isRunning}
            color={getQuickTestColor()}
          >
            {isRunning ? 'Testing...' : 'Quick Test'}
          </Button>

          <Button
            variant="contained"
            startIcon={isRunning ? <CircularProgress size={20} /> : <Speed />}
            onClick={runFullTest}
            disabled={isRunning}
          >
            {isRunning ? 'Testing...' : 'Full Test'}
          </Button>

          <Button
            variant="outlined"
            startIcon={isRunning ? <CircularProgress size={20} /> : <Storage />}
            onClick={runDiagnostic}
            disabled={isRunning}
            color="secondary"
          >
            {isRunning ? 'Diagnosing...' : 'Diagnostic'}
          </Button>
        </Box>

        {/* Quick Test Results */}
        {quickTestResult !== null && (
          <Alert 
            severity={quickTestResult ? 'success' : 'error'} 
            sx={{ mb: 2 }}
          >
            <Typography variant="body2">
              <strong>Quick Test:</strong> {quickTestResult ? 'PASSED' : 'FAILED'}
            </Typography>
            <Typography variant="caption" display="block">
              {quickTestResult 
                ? 'Basic SQLite operations are working correctly' 
                : 'There may be an issue with SQLite setup'
              }
            </Typography>
          </Alert>
        )}

        {/* Diagnostic Results */}
        {diagnosticResult && (
          <Alert 
            severity={diagnosticResult.success ? 'success' : 'error'} 
            sx={{ mb: 2 }}
          >
            <Typography variant="body2">
              <strong>Diagnostic:</strong> {diagnosticResult.success ? 'PASSED' : 'FAILED'}
            </Typography>
            <Typography variant="caption" display="block">
              {diagnosticResult.details}
            </Typography>
          </Alert>
        )}

        {/* Full Test Results */}
        {fullTestResult && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center" gap={1}>
                <Storage />
                Full Test Results
              </Typography>

              <Alert 
                severity={fullTestResult.success ? 'success' : 'error'} 
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  <strong>Overall:</strong> {fullTestResult.success ? 'PASSED' : 'FAILED'}
                </Typography>
              </Alert>

              {fullTestResult.results && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Component Tests:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip
                      label="Database Init"
                      color={fullTestResult.results.databaseInit ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip
                      label="Activity Creation"
                      color={fullTestResult.results.activityCreation ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip
                      label="Batch Insert"
                      color={fullTestResult.results.batchSampleInsert ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip
                      label="Data Retrieval"
                      color={fullTestResult.results.dataRetrieval ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Performance Metrics:
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Typography variant="body2">
                      <strong>Sample Insert:</strong> {fullTestResult.results.performance.sampleInsertTime}ms
                    </Typography>
                    <Typography variant="body2">
                      <strong>Query Time:</strong> {fullTestResult.results.performance.queryTime}ms
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Time:</strong> {fullTestResult.results.performance.totalTime}ms
                    </Typography>
                  </Box>

                  {fullTestResult.results.error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Error:</strong> {fullTestResult.results.error}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
          💡 Run these tests on an actual iOS device for accurate results. 
          The simulator may behave differently than real hardware.
        </Typography>
      </CardContent>
    </Card>
  );
};
