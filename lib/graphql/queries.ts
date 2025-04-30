import { gql } from "@apollo/client";

// Fragments
export const SUB_DEPARTMENT_FRAGMENT = gql`
  fragment SubDepartmentFields on SubDepartment {
    id
    name
  }
`;

export const DEPARTMENT_FRAGMENT = gql`
  fragment DepartmentFields on Department {
    id
    name
  }
`;

export const DEPARTMENT_WITH_CHILDREN_FRAGMENT = gql`
  fragment DepartmentWithChildrenFields on Department {
    ...DepartmentFields
    subDepartments {
      ...SubDepartmentFields
    }
  }
  ${DEPARTMENT_FRAGMENT}
  ${SUB_DEPARTMENT_FRAGMENT}
`;

// Queries
export const GET_DEPARTMENT = gql`
  query GetDepartment($id: Float!) {
    getDepartment(id: $id) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

export const GET_DEPARTMENTS = gql`
  query GetDepartments($page: Int!, $limit: Int!) {
    getDepartments(page: $page, limit: $limit) {
      items {
        ...DepartmentWithChildrenFields
      }
      totalPages
      totalItems
      currentPage
    }
  }
  ${DEPARTMENT_WITH_CHILDREN_FRAGMENT}
`;

export const GET_SUB_DEPARTMENTS = gql`
  query GetSubDepartments($departmentId: Float!) {
    getSubDepartments(departmentId: $departmentId) {
      ...SubDepartmentFields
    }
  }
  ${SUB_DEPARTMENT_FRAGMENT}
`;

// Mutations
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password })
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($name: String!, $subDepartments: [SubDeptInput!]) {
    createDepartment(input: { name: $name, subDepartments: $subDepartments }) {
      ...DepartmentWithChildrenFields
    }
  }
  ${DEPARTMENT_WITH_CHILDREN_FRAGMENT}
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: Float!, $name: String!) {
    updateDepartment(id: $id, name: $name) {
      ...DepartmentFields
    }
  }
  ${DEPARTMENT_FRAGMENT}
`;

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: Float!) {
    deleteDepartment(id: $id)
  }
`;

export const CREATE_SUB_DEPARTMENT = gql`
  mutation CreateSubDepartment($departmentId: Float!, $name: String!) {
    createSubDepartment(departmentId: $departmentId, name: $name) {
      ...SubDepartmentFields
    }
  }
  ${SUB_DEPARTMENT_FRAGMENT}
`;

export const UPDATE_SUB_DEPARTMENT = gql`
  mutation UpdateSubDepartment($id: Float!, $name: String!) {
    updateSubDepartment(id: $id, name: $name) {
      ...SubDepartmentFields
    }
  }
  ${SUB_DEPARTMENT_FRAGMENT}
`;

export const DELETE_SUB_DEPARTMENT = gql`
  mutation DeleteSubDepartment($id: Float!) {
    deleteSubDepartment(id: $id)
  }
`;
