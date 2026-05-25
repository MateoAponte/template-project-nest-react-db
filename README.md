# README.MD TEMPLATE

Some description about the project, what it does, and why it's important.

---

## Table of Contents

- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [Features](#-features)
- [Routes](#-routes)
- [SOLID Principles](#-solid-principles)
- [Design Patterns](#-design-patterns)
- [Tech Stack](#-tech-stack)
- [Areas for Improvement](#-areas-for-improvement)
- [Known Issues](#-known-issues)
- [Known Limitations](#-known-limitations)

## Prerequisites

What things you need to install the software and how to install them.

## Getting Started

How to clone the project, install dependencies, and config environment variables.

## Environment Variables

What environment variables are needed to run the project.

## Running the App

How to run the app on different enviroments.

How to use it on docker
Creating a postgres database
Prod building

## Features

What are the main features of the app.

### Each category

## Routes

List of all the routes and their descriptions.

## SOLID Principles

What are the SOLID principles used in the project in the next format:

(EXAMPLE)

### S — Single Responsibility

Each class, service, and hook has one reason to change.

- `UserService` manages user data only; `AuthService` manages authentication only
- `useLogin`, `useProductSearch`, `useInfiniteScroll` each encapsulate a single concern
- Controllers delegate all logic to services; repositories handle only data access

```typescript
// apps/back/src/user/user.service.ts
export class UserService {
  async create(dto: CreateUserDto): Promise<UserResponseDto>;
  async findAll(): Promise<UserResponseDto[]>;
  async update(id: string, dto: UpdateUserDto): Promise<UpdateResult>;
  // No auth logic, no HTTP concerns — only user data
}
```

## Design Patterns

All patterns are documented with inline comments in the relevant source files. With the next format:

### Frontend

| Pattern             | File(s)                          | Benefit                                                                                                                |
| ------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Template Method** | `components/BaseProductCard.tsx` | Defines a shared card skeleton; concrete variants override individual slots via render props without touching the base |

### Backend

| Pattern | File(s) | Benefit |
| ------- | ------- | ------- |

## Tech Stack

List of all the technologies used in the project. And a short explanation of their purpose.

### Repository

### Backend

### Frontend

## How the app was planned

Content and diagrams of the app architecture.
Image abd below a short description of the diagram + link to the original resource.

## Areas for Improvement

### Each area for improvement

With their own descriptions.

## Know Issues

### Each error

With their own descriptions.

## 📋 Known Limitations

- Each limitation
