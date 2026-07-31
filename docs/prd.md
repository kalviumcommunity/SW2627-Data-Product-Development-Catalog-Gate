#    CatalogGate  Product Requirements Document

---

**Links**

* [GitHub Repo](https://github.com/kalviumcommunity/SW2627-Data-Product-Development-Catalog-Gate)

**Document Contents**

1. Problem Statement  
2. Proposed Solution  
3. Goal  
4. Users  
5. Success Criteria  
6. Scope  
7. Mock UX  
8. Technical Requirements  
9. Notes & FAQs

# Problem Statement

A multi-vendor marketplace receives product listings, pricing updates, and inventory feeds from thousands of sellers daily, but no validation workflow detects inconsistent catalog data before customer-facing errors appear. 

# Proposed Solution

A platform that validates vendor catalog submissions before they are published, detects data quality issues and anomalies, and provides marketplace operators with actionable reports and approval workflows to prevent incorrect catalog data from reaching customers.

Key Capabilities:  
1\. Validating catalog submissions  
2\. Detecting data quality issues & anomalies  
3\. Providing Actionable Reports and approval workflows  
4\. Detect anomalous catalog changes that warrant manual review.

# Goal

Ensure that only high-quality, validated catalog data is published to the marketplace, reducing customer-facing errors while improving the efficiency of catalog operations.

# Users

1. **Vendors**  
   Responsible for uploading catalog files, receiving validation feedback, and resubmitting corrected data.  
     
2. **Catalog Admins**  
   Reviews validation results, manages the approval workflow, and publishes validated catalog updates.

# Success Criteria

Our Success Criteria is capabilities-oriented rather than outcome-oriented. This is because the product is an MVP lacking production users. Therefore, success will be measured by the successful implementation of the product's intended capabilities.

These capabilities would define the success for the product:

1. **Validation**  
* Validate every vendor catalog submission before publication.  
* Detect structural, data quality, and business-rule violations in uploaded catalogs.  
* Prevent submissions containing validation failures from progressing through the approval workflow.


  

2. **Reporting**  
* Generate clear validation reports for every processed catalog.  
* Show persona (vendor or catalog admin) specific KPIs in the dashboard.
* Provide actionable feedback that helps vendors resolve detected issues.
* Enable the catalog admin to track ingestions over the time.

3. **Workflow**  
* Enable vendors to upload, review validation feedback, and resubmit corrected catalogs.  
* Enable catalog administrators to review, approve, or reject catalog submissions.  
* Maintain a complete validation workflow from upload to approval.

4. **Intelligence**  
* Detect anomalous catalog changes that warrant manual review.  
* Track catalog quality metrics across uploads over time.

# Scope

V1 scope shall be limited to [Success Criteria](./prd.md) \#1, \#2, and \#3 only; named \- Validation, Reporting, and Workflow.

The intelligence layer will be added as a part of V2.

# Mock UX

For UX specifications see [UX Specs](./ux_specs.md) (UX Specification Tab)
High-fid mock UX: [here](https://kalviumcommunity.github.io/SW2627-Data-Product-Development-Catalog-Gate)

# Technical Requirements

**Tech Stack Mapping**  
The Tech stack is Python-based while the frontend would be a react app. We have streamlit in consideration however, its rerun model makes it exceptionally unsuitable for a client business application.

1. **Frontend Views:** React (Optionally, streamlit though it has serious architectural quirks making it unsuitable for a business application).  
2. **Server:** FastAPI   
3. **Data Processing & Transformation:** Pandas \+ Numpy  
4. **Database:** PostgreSQL 
5. **ORM:** Supabase 
6. **Validation & Data Modelling:** Pydantic  
7. **Reporting & Reporting:** Pandas & Plotly  
8. **Anomaly Detection:** Scikit-learn’s Isolation Forest
