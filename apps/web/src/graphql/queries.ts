import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email firstName lastName role }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      token
      user { id email firstName lastName role }
    }
  }
`;

export const GET_ME = gql`
  query Me { me { id email firstName lastName role } }
`;

export const GET_CONTACTS = gql`
  query Contacts($search: String, $lifecycleStage: String) {
    contacts(search: $search, lifecycleStage: $lifecycleStage) {
      id firstName lastName email phone position lifecycleStage tags createdAt
      company { id name }
    }
  }
`;

export const GET_CONTACT = gql`
  query Contact($id: String!) {
    contact(id: $id) {
      id firstName lastName email phone position lifecycleStage tags notes createdAt updatedAt
      company { id name }
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) { id firstName lastName email }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: String!, $input: UpdateContactInput!) {
    updateContact(id: $id, input: $input) { id firstName lastName email lifecycleStage }
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: String!) {
    deleteContact(id: $id)
  }
`;

export const GET_COMPANIES = gql`
  query Companies($search: String) {
    companies(search: $search) {
      id name industry website size createdAt
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) { id name }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: String!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) { id name }
  }
`;

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: String!) {
    deleteCompany(id: $id)
  }
`;

export const GET_DEALS = gql`
  query Deals($stage: String) {
    deals(stage: $stage) {
      id title value currency stage probability expectedCloseDate createdAt
      contact { id firstName lastName }
      company { id name }
      owner { id firstName lastName }
    }
  }
`;

export const CREATE_DEAL = gql`
  mutation CreateDeal($input: CreateDealInput!) {
    createDeal(input: $input) { id title value stage }
  }
`;

export const UPDATE_DEAL = gql`
  mutation UpdateDeal($id: String!, $input: UpdateDealInput!) {
    updateDeal(id: $id, input: $input) { id title value stage }
  }
`;

export const DELETE_DEAL = gql`
  mutation DeleteDeal($id: String!) {
    deleteDeal(id: $id)
  }
`;

export const GET_ACTIVITIES = gql`
  query Activities($limit: Int) {
    recentActivities(limit: $limit) {
      id type subject description completed dueDate createdAt
      contact { id firstName lastName }
      deal { id title }
      user { id firstName lastName }
    }
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) { id type subject }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      totalContacts totalCompanies totalDeals openDealsValue wonDealsValue
      recentActivities {
        id type subject createdAt
        user { id firstName lastName }
      }
    }
  }
`;
