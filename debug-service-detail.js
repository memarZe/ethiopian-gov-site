// Test script to debug service detail loading
console.log('=== SERVICE DETAIL DEBUG ===');

// Test 1: Check if mock services data is accessible
import { mockServices } from './src/data/mockServices.js';
console.log('Mock services count:', mockServices.length);
console.log('First service:', mockServices[0]);

// Test 2: Test API service getServiceById
import { apiService } from './src/services/api.js';
const testId = '1';
console.log('Testing service ID:', testId);

apiService.getServiceById(testId)
  .then(result => {
    console.log('API result:', result);
  })
  .catch(error => {
    console.error('API error:', error);
  });
