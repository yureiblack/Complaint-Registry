# 🗂️ Project Idea: Digital Complaint Management System

## 📌 Overview

This project is a **Digital Complaint Management System** designed for small-scale organizations (such as companies, campuses, or societies) to collect, track, and resolve complaints in a structured and transparent manner.

All users are authenticated, but they are given control over **public visibility** and **anonymity** of their complaints. The system focuses heavily on **backend flow**, **state management**, and **access control**, making it suitable as a backend-heavy full-stack project.

---

## 🎯 Problem Statement

Traditional complaint handling systems often suffer from:
- Poor tracking of complaint status
- Lack of transparency for users
- No clear lifecycle for complaints
- Privacy concerns when complaints are made public

This project aims to solve these issues by implementing a **state-driven complaint lifecycle** with optional public visibility and anonymity, while maintaining full traceability for administrators.

---

## 👥 Actors

### 1. User (Complainant)
- All users must be logged in
- Can submit complaints
- Can control visibility and anonymity
- Can track complaint status
- Receives notifications on all status changes

### 2. Admin
- Reviews and manages complaints
- Changes complaint status
- Resolves or rejects complaints
- Oversees automatic complaint closure

---

## 🔁 Complaint Lifecycle

Each complaint follows a strict lifecycle:
→ SUBMITTED
→ UNDER_REVIEW
→ IN_PROGRESS
→ RESOLVED / REJECTED
→ CLOSED

- Status transitions are controlled by the admin or system
- Complaints cannot skip states
- Closure can happen automatically due to inactivity

---

## 📝 Complaint Submission

A user submits a complaint with:
- Title (required)
- Description (required)
- Category (optional)
- Location (optional)
- Optional image
- Visibility options:
  - Public or Private
  - Anonymous or Named (if public)

On submission:
- Status is set to `SUBMITTED`
- Complaint is linked to the user
- A unique complaint ID is generated

---

## 🌐 Public Homepage

The homepage displays:
- Only complaints marked as **public**
- Complaints within a selected time range
- Complaint title, status, date
- Reporter name (if not anonymous) or “Anonymous”

This allows transparency while respecting user privacy.

---

## 🔍 Search Functionality

Search is provided to:
- Check if a similar complaint already exists
- Reduce duplicate complaints

Search scope:
- Title
- Description

Visibility rules:
- Public users see only public complaints
- Logged-in users see public complaints + their own private complaints
- Admins see all complaints

---

## 🔔 Notifications

Users are notified on:
- Complaint review start
- Work in progress
- Resolution
- Rejection
- Automatic closure due to inactivity

Notifications can be implemented as:
- In-app notifications
- Email alerts
- Simulated WhatsApp-style messages

---

## 🔓 Visibility & Anonymity Control

Users can update at any time:
- `isPublic` (public/private)
- `isAnonymous` (anonymous/named)

Effects are reflected immediately:
- Complaint appears or disappears from homepage
- Reporter identity is shown or hidden dynamically

---

## 🔒 Read-Only Closure

A complaint is automatically marked `CLOSED` when:
- It remains inactive in `IN_PROGRESS` for a long time

After closure:
- Complaint becomes read-only
- Still searchable
- Remains visible in user history
- Maintains public visibility rules

---

## 🧠 Key Design Decisions

- Anonymity is handled at the **display level**, not authentication
- Optional fields are treated as metadata, not system drivers
- Complaint lifecycle is enforced via enums
- Attachments and notifications follow complaint lifecycle
- System prioritizes backend correctness over UI complexity

---

## 🚀 Future Enhancements

- Department-based complaint routing
- Complaint prioritization
- Analytics dashboard
- Government-scale deployment with location-based filtering
- Real-time notification integration

---

## ✅ Conclusion

This project demonstrates:
- Backend-heavy system design
- State management and lifecycle enforcement
- Role-based access control
- Privacy-conscious public data handling

It is designed to be scalable, realistic, and suitable for academic evaluation while remaining implementable within a college-level project scope.
