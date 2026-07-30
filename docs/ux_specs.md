# **CatalogGate UX Specification (V1)**

# Introduction

This document complements the PRD. It defines the intended user experience, information architecture, interaction philosophy and visual direction for CatalogGate.

# Product Philosophy

CatalogGate should feel like an operational control system rather than a consumer web application. Users spend most of their time reviewing information, monitoring workflows and making decisions. The interface should therefore optimize readability, situational awareness and efficiency.

# Core Principles

1. Workflow before navigation.  
2. Information before decoration.  
3. Actions remain close to the data they affect.  
4. Progressive disclosure over clutter.   
5. Consistency over novelty.  
6. Status is always visible.

# Product Topology

CatalogGate is a single SaaS platform with three experiences.

1. **Landing Page:**: Public entry point introducing the platform and routing users to authentication.  
2. **Vendor Portal**: Focused workspace for vendors. Limited to their own catalog data.  
3. **Catalog Admin Portal:** Operational workspace with visibility across all vendors and validation jobs.

# Navigation Model

1. Landing \- Product \- Features \- Workflow \- Vendor Login \- Client Login  
2. Vendor \- Upload Catalog \- Upload History \- Validation Reports  
3. Catalog Admin \- Dashboard \- Upload Queue \- Validation Results \- Validation Rules  
4. Global top bar: Notifications, Profile, Contextual Search (Admin only).

# Landing Page

**Purpose:** Build trust, explain the platform and route users.

**Sections:** Hero, Problem/Solution, Workflow, Capabilities

**CTAs:** Vendor Login Client Login

Avoid pricing, testimonials and marketing-heavy content.

# Catalog Admin Portal

1. **Dashboard**: Answers: What is happening now? What needs attention?  
2. **Components:** Active jobs, trend chart, recent uploads, pending approvals.  
3. **Upload Queue**: Monitor processing state, retry, inspect.  
4. **Validation Results:** Large searchable table with filters, sorting, pagination and row actions.  
5. **Validation Detail:** Opens as a side drawer. Shows submitted values, failed rule, expected value, actual value and explanation.  
6. **Validation Rules:** Read-only catalogue grouped by category and severity.

# Vendor Portal

1. **Upload Catalog:** Drag-and-drop upload, supported formats, upload progress and validation status.  
2. **Upload History:** Chronological history with status, record counts and downloadable reports.  
3. **Validation Report:** Summary metrics followed by detailed failed records and warnings.

# Shared Interaction Patterns

* Tables are the primary visualization.  
* Filters persist until cleared.  
* Row details open in drawers where possible.  
* Long-running tasks expose progress.  
* Destructive actions require confirmation.  
* Toasts communicate completion.  
* Empty, loading and error states exist for every screen.


# Visual Language

* Light theme.   
* Enterprise SaaS aesthetic.   
* Neutral surfaces.   
* 8-12px corner radius.   
* Subtle elevation.   
* Blue primary accent: #CEF5EE   
* Semantic colors only: Red=Error Amber=Warning Green=Passed Blue=Processing Gray=Pending

# Future Extensibility

Layouts should naturally accommodate future intelligence features without placeholder UI. Dashboard KPI regions and validation detail panels should allow future insertion of predictive insights.

# Design Constraints

**Do not include:**

*  AI recommendations  
* Complex administration  
* Marketing-style dashboards  
* Decorative visual effects

**Prefer:** 

* Dense tables   
* Reusable layouts  
* Persistent navigations  
* Minimal clicks  
* Workflow-first design

