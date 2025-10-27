// Fix: Implemented mock API service for saving and fetching leads.
import { LeadData } from '../types';

// Mock API service using localStorage
const saveLeadToLocalStorage = (lead: LeadData) => {
    try {
        const existingLeadsString = localStorage.getItem('leads');
        const existingLeads = existingLeadsString ? JSON.parse(existingLeadsString) : [];
        existingLeads.push(lead);
        localStorage.setItem('leads', JSON.stringify(existingLeads));
    } catch (error) {
        console.error("Could not save lead to local storage", error);
    }
};

const getLeadsFromLocalStorage = (): LeadData[] => {
     try {
        const existingLeadsString = localStorage.getItem('leads');
        return existingLeadsString ? JSON.parse(existingLeadsString) : [];
    } catch (error) {
        console.error("Could not get leads from local storage", error);
        return [];
    }
}

export const saveLead = (leadData: LeadData): Promise<void> => {
  return new Promise((resolve) => {
    console.log('Saving lead:', leadData);
    saveLeadToLocalStorage(leadData);
    // Simulate network delay
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const fetchLeads = (): Promise<LeadData[]> => {
    return new Promise((resolve) => {
        const leads = getLeadsFromLocalStorage();
        // Simulate network delay
        setTimeout(() => {
            resolve(leads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }, 500);
    });
};
