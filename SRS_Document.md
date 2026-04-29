# Software Requirements Specification (SRS)
# Offline Payment System

---

## 1. Title Page
**Project Name:** Offline Payment System
**Team Name:** Team Innovators
**Date:** April 29, 2026
**Version:** 1.0

---

## Executive Summary

The Offline Payment System is an innovative financial technology solution designed to facilitate secure, token-based digital transactions in environments with limited or no internet connectivity. By leveraging pre-signed digital tokens and cryptographic validation, the system guarantees safe settlement for merchants while providing a seamless payment experience for users. This document outlines the comprehensive software requirements, architecture, and technical specifications for the development and deployment of the platform.

---

## 2. Abstract

This project introduces a robust offline digital payment ecosystem that empowers users to conduct financial transactions without relying on real-time internet connectivity. 
**Purpose:** To bridge the digital divide and ensure uninterrupted commerce in remote, rural, or low-connectivity areas where traditional digital payments fail.
**Key Innovation:** The utilization of pre-loaded, cryptographically signed offline tokens from banks. These tokens act as digital cash, enabling secure peer-to-peer and peer-to-merchant transfers offline, with an automated conflict-free synchronization mechanism once connectivity is restored.

---

## 3. Introduction

### 3.1 Problem Statement
In developing regions and remote areas, frequent network outages and poor internet infrastructure severely hinder the adoption of digital payments, forcing users to rely heavily on physical cash.

### 3.2 Existing System Limitations
Traditional digital payment systems (like standard UPI, Apple Pay, or credit cards) require real-time authentication with a central banking server. If the network drops, the transaction fails, leading to lost business for merchants and frustration for consumers.

### 3.3 Proposed Solution
We propose an "Offline-First" digital wallet. Users securely load tokens onto their devices while online. When offline, these tokens are cryptographically verified and exchanged directly with merchants. The merchant's device stores these tokens and settles them with the bank once the internet returns.

### 3.4 Objectives of the Project
- Enable 100% offline transactions with zero network dependency during the payment phase.
- Ensure bank-grade security and prevent double-spending using cryptographic signatures.
- Provide a seamless user experience that mirrors online payments.
- Guarantee merchant safe-settlement.

---

## 4. Scope of the Project

**Where the system can be used:**
- Remote rural villages with limited telecom infrastructure.
- High-density areas with network congestion (e.g., concerts, sports stadiums).
- Underground transit systems (e.g., subways, trains).
- In-flight purchases.

**Real-world applications:**
- Retail store checkout.
- Peer-to-peer fund transfers.
- Toll booths and parking payments.

**Target users:**
- Consumers in low-connectivity regions.
- Small and medium enterprise (SME) merchants.
- Travelers and commuters.

---

## Feature Summary Table

| Feature Category | Core Capabilities |
| :--- | :--- |
| **Authentication** | PIN Lock, Biometrics, Secure Token Loading |
| **Offline Payments** | QR Code Scanning, Token Exchange, Tamper Detection |
| **Synchronization** | Auto-Reconnection, Ledger Sync, Webhook Alerts |
| **Security** | Brute-force Protection, Digital Signatures, Vault Storage |

---

## 5. Functional Requirements

1. **User Authentication:** The system shall authenticate users via a secure 4-digit PIN and biometrics before allowing any transaction or wallet access.
2. **Offline Token Loading:** Users shall be able to reserve offline capacity and download digitally signed tokens when internet connectivity is available.
3. **Secure Token Validation:** The system shall cryptographically verify the integrity and origin of tokens before processing an offline payment.
4. **QR Code Payment:** Users shall be able to initiate payments by scanning a merchant's static or dynamic QR code.
5. **Merchant Payment Acceptance:** The merchant application shall accept, validate, and securely store offline tokens in a local vault.
6. **Transaction History:** The system shall maintain an immutable, filterable ledger of all pending, completed, and failed transactions.
7. **Offline-to-Online Synchronization:** Upon detecting network restoration, the system shall automatically push locally stored offline transactions to the banking server for settlement.
8. **Fraud Detection Alerts:** The system shall detect suspicious activity (e.g., brute-force PIN attempts) and automatically lock the application.
9. **Discord Notification Integration:** The backend shall push real-time transaction and fraud alerts to a dedicated Discord channel via Webhooks.
10. **Payment Confirmation System:** The UI shall display immediate visual and auditory feedback (e.g., green checkmark) upon successful offline token exchange.
11. **User Profile Management:** Users shall be able to manage linked bank accounts, notification preferences, and security settings.
12. **Bank Integration:** The system shall support multiple linked bank accounts and designate a primary account for offline reserves.
13. **Wallet Balance Management:** The system shall maintain distinct ledgers for the online bank balance and the offline reserved token capacity.
14. **Secure Encryption:** All stored tokens and local transaction logs shall be encrypted at rest.
15. **Network Status Detection:** The application shall continuously monitor the network state and seamlessly switch between Online and Offline modes.
16. **Auto Reconnection Handling:** The system shall implement exponential backoff and automatic retry logic for failed background syncs.

---

## 6. Non-Functional Requirements

- **Security:** The system must prevent unauthorized access, replay attacks, and double-spending. Local data must be encrypted (e.g., AES-256).
- **Reliability:** The system must not lose transaction data even if the application crashes or the device loses power during an offline payment.
- **Scalability:** The backend synchronization engine must handle thousands of concurrent batch uploads when a network area comes back online.
- **Performance:** Offline QR code generation, scanning, and token validation must complete within 500 milliseconds to mimic online speeds.
- **Availability:** The core payment capability must be 100% available regardless of network status.
- **Usability:** The UI must be highly intuitive, adhering to modern fintech design standards, with clear indicators of network status and wallet balances.
- **Maintainability:** The codebase must follow modular architecture principles to allow easy integration of new banks and payment methods.

---

## 7. System Architecture

The architecture follows a decoupled, offline-first decentralized model.

- **Frontend (Client Application):** A React-based Single Page Application (SPA) utilizing a local persistence layer. It handles the UI, QR scanning, token validation logic, and the sync queue.
- **Backend (API Gateway):** A Node.js/Express server that acts as a bridge between the client and the core banking infrastructure.
- **Database:** A NoSQL database (e.g., MongoDB or Firebase Firestore) used to store user profiles, global transaction ledgers, and token lifecycle states.
- **APIs:** RESTful endpoints for token issuance, ledger settlement, and webhook dispatching.
- **Payment Flow:** 
  1. Sender scans Receiver's QR. 
  2. Sender selects amount. 
  3. Sender enters PIN. 
  4. Device selects valid offline tokens and generates a transaction payload. 
  5. Payload is transmitted via QR code or local peer-to-peer network to the Receiver.
- **Offline Token Workflow:** Tokens are pre-fetched from the Bank Server, stored in the local secure vault, consumed during offline transfer, and marked as 'spent' locally until synced.
- **Sync Mechanism:** A background worker monitors connectivity. When online, it pushes the `TransactionQueue` to the server and updates local balances.

---

## Tech Stack Summary Table

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS | Fast, responsive, modern user interface. |
| **Backend** | Node.js, Express.js | High-performance asynchronous API server. |
| **Database** | Firebase / MongoDB | Scalable storage for ledgers and user data. |
| **State/Local Storage** | React Context API, IndexedDB | Managing application state and offline data persistence. |
| **Animations** | Framer Motion | Smooth, premium micro-interactions. |
| **Alerting** | Discord Webhooks | Real-time observability and security alerting. |

---

## 8. Technologies Used

### Frontend
- **React.js:** Component-based UI library for building dynamic interfaces.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI styling and theming.
- **Vite:** Next-generation frontend tooling for fast compilation and hot-module replacement.

### Backend
- **Node.js:** JavaScript runtime built on Chrome's V8 engine for scalable network applications.
- **Express.js:** Minimalist web framework for Node.js to easily create robust REST APIs.

### Database
- **Firebase / MongoDB:** Used for handling high-throughput reads/writes of transaction data and managing user authentication states globally.

### Other Technologies
- **QR Code Generator:** Libraries (like `react-qr-code` or `html5-qrcode`) for rendering and scanning payment endpoints.
- **Discord Webhooks:** Automated system to send rich-embed alerts to development and security channels.
- **JWT Authentication:** For secure, stateless API communication when online.
- **Local Storage / IndexedDB:** For secure, persistent local caching of tokens and the offline transaction queue.
- **Vercel Deployment:** Platform-as-a-service for hosting the frontend application with edge caching.

---

## API Integration Table

| API Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/tokens/mint` | POST | Requests digitally signed tokens from the bank. |
| `/api/transactions/sync` | POST | Uploads the offline transaction queue for settlement. |
| `/notify` | POST | Triggers Discord webhook for events (Fraud, Sync, Pay). |
| `/api/auth/verify-pin` | POST | Verifies user PIN against the server hash (when online). |

---

## 9. APIs Used

- **QR Code APIs:** Utilized to encode complex transaction payloads and token metadata into a scannable format.
- **Discord Webhook API:** Integrated to provide a real-time observability pipeline for transaction completions and security breaches without building a custom admin dashboard.
- **Bank Verification APIs (Mock):** Simulates core banking infrastructure to validate token signatures and check account balances.
- **Authentication APIs:** Handles session management, JWT issuance, and biometric token validation.
- **Sync APIs:** Specialized endpoints designed to handle bulk inserts, resolve conflicts, and prevent double-spending during the reconciliation phase.

---

## 10. Database Design

- **User Table:** `user_id`, `name`, `phone`, `email`, `hashed_pin`, `kyc_status`, `device_id`.
- **Merchant Table:** `merchant_id`, `business_name`, `vpa`, `settlement_account`.
- **Transactions Table:** `tx_id`, `sender_id`, `receiver_id`, `amount`, `status` (Pending/Completed/Failed), `timestamp`, `mode` (Online/Offline).
- **Token Storage:** `token_id`, `value`, `signature`, `status` (Active/Spent), `issued_to`.
- **Wallet Data:** `user_id`, `online_balance`, `offline_reserved_balance`, `linked_banks`.

---

## 11. UML Diagrams (Descriptions)

- **Use Case Diagram:** Shows actors (User, Merchant, Bank Server) interacting with use cases like "Load Tokens", "Scan QR", "Make Offline Payment", and "Sync Ledger".
- **Data Flow Diagram (DFD):** Illustrates the flow of data from the User requesting tokens -> Token generation at Bank -> Storage in Local Vault -> Transfer to Merchant -> Final settlement via Sync.
- **Sequence Diagram:** Details the step-by-step chronological operations of an offline payment: User scans QR -> App validates PIN -> App selects Tokens -> App generates QR payload -> Merchant scans -> Merchant validates signature -> Merchant shows Success.
- **Activity Diagram:** Maps the logical flow of the network monitor: Check connection -> If Online, process queued transactions -> If Offline, switch to token-based local routing.
- **System Architecture Diagram:** Displays the client devices (Sender/Receiver), the local IndexedDB storage, the network boundary, the Node.js API Gateway, and the Core Banking Database.

---

## 12. Security Features

- **Digital Signature Verification:** Bank servers sign offline tokens using asymmetric cryptography (RSA/ECC). The merchant device uses the bank's public key to instantly verify the token's authenticity offline.
- **Encryption:** AES-256 encryption secures the local IndexedDB token vault.
- **Fraud Detection:** Hard-coded limits on PIN attempts (e.g., 3 strikes) trigger local application lockouts and instant Discord webhook alerts to the security team.
- **Replay Attack Prevention:** Each offline token has a unique nonce and is strictly single-use. The transaction payload includes a timestamp and a unique transaction hash.
- **Tamper Protection:** The application utilizes state hashing. If the local storage is manually edited (tampering), the state hash mismatches, forcing a security lock.

---

## 13. Future Improvements

- **Biometric Authentication:** Implementing WebAuthn or native device biometrics (FaceID/Fingerprint) to replace or augment PIN entry.
- **NFC Payments:** Allowing users to tap devices to transfer offline tokens instead of scanning QR codes.
- **Wearable Device Payments:** Extending the offline vault to smartwatches for phone-free transactions.
- **AI-Based Analytics:** Integrating predictive models to suggest when users should load tokens based on their travel history and connectivity patterns.
- **Offline Rewards System:** Providing loyalty points and cashback natively within the offline transaction payload.
- **Multi-bank Expansion:** Creating a standardized token protocol allowing interoperability between tokens issued by different central banks.

---

## 14. Advantages of the System

- **Financial Inclusion:** Allows users in zero-connectivity areas to participate in the digital economy.
- **High Reliability:** Immune to server outages, ISP failures, or network congestion.
- **Speed:** Offline peer-to-peer verification eliminates network latency, resulting in sub-second payment clearing.
- **Privacy:** Offline transactions do not transmit real-time location or telemetry data to servers until voluntarily synced.

---

## 15. Limitations

- **Hardware Dependency:** Requires devices with a functioning camera (for QR) and sufficient secure storage space.
- **Pre-funding Required:** Users cannot spend money offline if they haven't reserved tokens while online beforehand.
- **Loss Risk:** If a device is permanently destroyed or lost before synchronization, the offline tokens stored locally may be irretrievable (similar to losing physical cash), unless advanced cloud-key recovery is implemented.

---

## 16. Testing & Validation

- **Unit Testing:** Validating the cryptographic signature and token selection algorithms.
- **Integration Testing:** Ensuring the local queue correctly formats payloads for the Node.js backend.
- **Network Simulation Testing:** Using tools to throttle and completely drop internet connections to verify the seamless UI transition and robust offline payment processing.
- **Security Testing:** Attempting brute-force PIN attacks and local database tampering to validate lockouts and webhook alerting.

---

## 17. Conclusion

The Offline Payment System is a critical step forward in creating a resilient, universally accessible digital economy. By combining the immediate, trustless nature of physical cash with the convenience and security of modern cryptography, this project successfully mitigates the infrastructure limitations that plague traditional digital wallets. It is highly scalable, secure, and ready to bridge the gap in digital financial inclusion.

---

## 18. References

1. RSA Cryptography Standards & Documentation.
2. React.js and Vite Official Documentation.
3. Node.js and Express.js REST API Design Patterns.
4. Discord Webhooks API Reference Guide.
5. RBI (Reserve Bank of India) Guidelines on Offline Retail Payments (Concept reference).
