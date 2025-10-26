// Initialize app with sample data if empty

import { getFromStorage, saveToStorage, STORAGE_KEYS } from './storage';
import {
  getSampleUsers,
  getSamplePharmacies,
  getSampleSymptoms,
  getSampleHistoricalData,
  getSampleBlogPosts
  , getSampleHealthFacilities, getSampleFacilityReports
} from '../data/sampleData';
import { updatePredictions } from './predictions';

/**
 * Initialize the application with sample data
 * Only runs if localStorage is empty
 */
export function initializeApp(): void {
  // Check existing users
  const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);

  const isFresh = users.length === 0;

  // Ensure sample users exist (e.g., facility test account) even on non-fresh setups
  try {
    const sampleUsers = getSampleUsers();
    let addedUser = false;
    sampleUsers.forEach(su => {
      if (!users.some((u: any) => u.username === su.username)) {
        users.push(su as any);
        addedUser = true;
      }
    });
    if (addedUser) saveToStorage(STORAGE_KEYS.USERS, users);
  } catch (e) {
    // ignore
  }

  console.log('Initializing app with sample data...');

  if (isFresh) {
    // Initialize users
    saveToStorage(STORAGE_KEYS.USERS, getSampleUsers());
  }

  if (isFresh) {
    // Initialize pharmacies
    saveToStorage(STORAGE_KEYS.PHARMACIES, getSamplePharmacies());
  }

  // Ensure sample health facility and facility user exist for testing
  try {
    const existingFacilities = getFromStorage<import('../utils/types').HealthFacility[]>(STORAGE_KEYS.HEALTH_FACILITIES, []);
    const sampleFacilities = getSampleHealthFacilities();
    // Add any sample facilities that are missing
    sampleFacilities.forEach(sf => {
      if (!existingFacilities.some((f: any) => f.id === sf.id || f.username === sf.username)) {
        existingFacilities.push(sf as any);
      }
    });
    saveToStorage(STORAGE_KEYS.HEALTH_FACILITIES, existingFacilities);

    // Ensure facility reports initialized if fresh
    if (isFresh) {
      saveToStorage(STORAGE_KEYS.FACILITY_REPORTS, getSampleFacilityReports());
    }
  } catch (e) {
    // ignore if sample functions not available
  }

  if (isFresh) {
    // Initialize symptoms
    saveToStorage(STORAGE_KEYS.SYMPTOMS, getSampleSymptoms());

    // Initialize historical data
    saveToStorage(STORAGE_KEYS.HISTORICAL_DATA, getSampleHistoricalData());

    // Initialize blog posts
    saveToStorage(STORAGE_KEYS.BLOG_POSTS, getSampleBlogPosts());
  }

  // Initialize empty audit log
  saveToStorage(STORAGE_KEYS.AUDIT_LOG, []);

  // Calculate initial predictions
  updatePredictions();

  console.log('App initialized successfully!');
}
