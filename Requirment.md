

## The Perfected Directory Application Requirements

### 📱 Application Overview (Refined)

A **mobile directory application** designed for secure access and seamless navigation:

1.  **Authentication:** Users log in securely via **OTP verification** using their mobile number.
2.  **Access Control:** Users select an affiliated company, providing a foundational layer for access control and data segmentation.
3.  **Core Functionality:** Users can browse a **paginated, searchable, and sortable** list of members within the selected company.
4.  **Interaction:** Detailed member profiles offer direct, one-tap contact options (Call, Message, Email).

-----

### 1\. User Authentication via Mobile Number (OTP)

#### User Flow (Confirmed)

  * **Login Screen:** Enter mobile number $\rightarrow$ Tap "Send OTP".
  * **OTP Verification Screen:** Receive SMS $\rightarrow$ Enter OTP $\rightarrow$ System verifies.
  * **Success:** Logged in $\rightarrow$ Redirect to Company Selection.

#### Backend (Refined)

  * **OTP Service:** **Firebase Authentication** is highly recommended for cross-platform simplicity and reliability in OTP delivery.
  * **Token Generation:** Use **JWT (JSON Web Tokens)** for stateless, secure API authentication.
      * **Payload Requirement:** The token *must* contain the user's `user_id` and the most recently selected `company_id` to streamline subsequent API calls and enforce company-level access control.
  * **Rate Limiting:** Implement strict **rate limiting** on the "Send OTP" endpoint to prevent SMS abuse and denial-of-service attacks.
  * **Security:** OTPs must have a short, enforced expiry time ($\le 2$ minutes) and must be single-use.

-----

### 2\. Company Selection Screen

#### UI Design (Enhanced)

  * **List Style:** Card view (Name + Logo + Short Description).
  * **Interaction:** Ensure a clear visual state change on selection before navigating.

#### Backend (Refined)

  * **API:** `GET /companies/available`
      * *Authorization:* Requires a valid JWT token.
      * *Logic:* Should only return companies the authenticated user is **associated with** (to prevent unauthorized discovery). If the user belongs to only one company, consider auto-selecting it.
  * **Company Schema (Finalized):**

<!-- end list -->

```json
{
  "company_id": "abc12345-def6-7890-abcd-1234567890ef", // Use a UUID
  "name": "Acme Corp",
  "logo_url": "https://cdn.example.com/acme/logo_thumb.png", // Specify thumbnail for list view
  "description": "Leading firm in engineering and innovation."
}
```

-----

### 3\. User List within Selected Company

#### UI Design (Enhanced)

  * **Features:**
      * **Search Bar:** Global search filter (by Name, Role, or Department).
      * **Sort/Filter:** Simple sorting options (e.g., Alphabetical by Name, by Department).
  * **List Item:**
      * Profile Picture (small **lazy-loaded** thumbnail).
      * Name (Bold).
      * Role/Designation.
      * **Tappable/Selectable** area covering the whole row.

#### Backend (Refined)

  * **API:** `GET /companies/:company_id/users?page=1&limit=20&search=john&sort_by=name`
      * **Pagination:** Essential for scalability. Default limit should be 20-50.
      * **Filtering & Sorting:** Support for URL query parameters to handle search and sort logic.
      * **Authorization:** The `company_id` in the API call *must* match the `company_id` extracted from the user's JWT token to ensure they are only viewing the directory they have access to.
  * **User List Object (Minimal for list view):**

<!-- end list -->

```json
{
  "id": "user123-abcd-...",
  "name": "John Doe",
  "role": "Manager",
  "image_url_thumb": "https://cdn.example.com/users/john_thumb.jpg", // Small, optimized image
  "department": "Engineering" 
}
```

-----

### 4\. User Detail View (Profile Screen)

#### UI Design (Confirmed)

  * **Complete Profile:** Name, Image, Role, Contact Number, Email, Address, Custom Fields.
  * **Action Icons:**
      * 📞 **Call:** Initiate $\rightarrow$ `tel:{contact_number}`
      * 💬 **Message:** Open SMS $\rightarrow$ `sms:{contact_number}`
      * ✉️ **Email:** Open Mail app $\rightarrow$ `mailto:{email}`

#### Backend (Confirmed)

  * **API:** `GET /users/:user_id`
  * **Data Consistency:** Ensure the user ID requested belongs to the user's currently selected company before returning the data.
  * **Extended User Object (Comprehensive):**

<!-- end list -->

```json
{
  "id": "user123-abcd-...",
  "name": "John Doe",
  "role": "Manager",
  "contact_number": "+1 (555) 123-4567",
  "email": "john.doe@acme.com",
  "image_url_full": "https://cdn.example.com/users/john_full.jpg", // High-res image
  "address": "123, Main Street, Anytown, CA 90210",
  "department": "Engineering",
  "date_of_birth": "1985-05-15" // ISO 8601 format
  // Add other custom fields as needed
}
```

-----

### ✅ Additional Considerations (Enhanced)

| Area | Requirement | Rationale |
| :--- | :--- | :--- |
| **Tech Stack** | **Frontend:** React Native (preferred for speed) / Flutter. **Backend:** Node.js (Express/NestJS) for non-blocking I/O. **Database:** **PostgreSQL** (due to its ACID compliance and strong support for relational data structures like users, companies, and their memberships). | Maintains suggestion, but prioritizes PostgreSQL for structured data integrity. |
| **Security** | **Data Masking:** Only logged-in users within the *same company* can view full contact details. Public directory access is forbidden. | Enforces data privacy and prevents scraping. |
| **Security** | **Input Validation:** Strict validation on mobile number format, OTP length, and all API payload data to prevent injection attacks. | Essential for robust application security. |
| **Scalability** | **CDN Usage:** All `logo_url` and `image_url` fields must point to assets served via a **Content Delivery Network (CDN)** (e.g., AWS S3/Cloudfront, Cloudflare) for fast global image loading. | Critical for a fast mobile experience. |
| **User Experience (UX)** | **Offline Caching:** Implement offline caching for the company list and recently viewed member profiles. | Improves performance and handles flaky mobile connections gracefully. |
| **Data Modeling**| **M:N Relationship:** A user must be able to be a member of **Multiple Companies** (Many-to-Many relationship). The company selected on the second screen *sets the context* for the directory view. | Future-proofs the application for users who consult or work for several entities. |

-----

### 🧭 User Flow Summary (Final)

**Secure, Contextual, and Efficient**

1.  **Authentication:** Mobile Number $\rightarrow$ OTP $\rightarrow$ **JWT Token** issued.
2.  **Context Selection:** User views list of available companies $\rightarrow$ Selects a company $\rightarrow$ **Company Context** established in memory/token.
3.  **Directory:** Views **Paginated, Searchable** list of members for the selected company.
4.  **Profile:** Clicks member $\rightarrow$ Views complete profile $\rightarrow$ **One-tap** Call/Message/Email.