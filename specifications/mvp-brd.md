# 🐷 MITSORS - Livestock Price Monitoring Platform MVP Specification

## Market for Integrated Trading System of Raisers and Sellers

## 📱 App Overview

MITSORS is a **livestock price monitoring platform** that provides real-time liveweight price data for hogs across the Philippines. The platform aggregates price inputs from traders (both verified and unverified) to help users make informed decisions about livestock pricing in their region.

**🇵🇭 Geographic Scope**: This app is specifically designed for and operates exclusively in the **Philippines**, with location data structured around Philippine regions and cities/municipalities.

### 🎯 Target Users

- **Hog Raisers**: Farmers who want to monitor current market prices in their area
- **Traders**: Both verified and unverified traders who input price data
- **Market Sellers**: Vendors who need to track price trends
- **General Public**: Anyone interested in livestock pricing information

### 💰 Price Data Focus

The platform focuses on **liveweight price** (price per kilogram) for hogs, which is the standard pricing method in the Philippine livestock market.

---

## 🚀 MVP Features

### 1. 📍 Location Selection (On App Open)

**Implementation**: First-time user flow that collects location data before showing dashboard

#### Location Selection Flow

When a user opens the app for the first time (or if location is not set):

**Step 1: First Name and Last Name**

- **First Name Input**:
  - Text input field for user's first name
  - Required field
  - Validation: Minimum 2 characters, maximum 50 characters
  - Placeholder: "Enter your first name"
- **Last Name Input**:
  - Text input field for user's last name
  - Required field
  - Validation: Minimum 2 characters, maximum 50 characters
  - Placeholder: "Enter your last name"

**Step 2: Region Selection**

- Display Philippine regions dropdown:
  - NCR (National Capital Region)
  - CAR (Cordillera Administrative Region)
  - Region I (Ilocos Region)
  - Region II (Cagayan Valley)
  - Region III (Central Luzon)
  - Region IV-A (CALABARZON)
  - Region IV-B (MIMAROPA)
  - Region V (Bicol Region)
  - Region VI (Western Visayas)
  - Region VII (Central Visayas)
  - Region VIII (Eastern Visayas)
  - Region IX (Zamboanga Peninsula)
  - Region X (Northern Mindanao)
  - Region XI (Davao Region)
  - Region XII (SOCCSKSARGEN)
  - Region XIII (Caraga)
  - BARMM (Bangsamoro Autonomous Region in Muslim Mindanao)

**Step 3: City/Municipality Selection**

- Dynamic dropdown populated based on selected region
- Shows only cities/municipalities within the chosen region
- Uses Philippine Standard Geographic Code (PSGC) data

**Step 4: User Role Selection**

- **Checkbox Selection**: User can select one or more roles
- **Available Roles**:
  - ☐ **Hog Raiser** - User raises livestock
  - ☐ **Public Market Seller** - User sells in public markets
  - ☐ **Midman** - User acts as intermediary/trader
- **Selection Rules**:
  - User can select **all roles** (multiple checkboxes can be selected)
  - At least one role must be selected to continue
  - Roles can be changed later in profile settings
- **Purpose**: Helps identify user's role in the livestock trading ecosystem
- **Storage**: Selected roles stored in AsyncStorage (local device storage) along with location

**Location Data Management:**

- **Data Source**: Philippine Statistics Authority (PSA) PSGC
- **Initial Storage**: First Name, Last Name, Region, City, and User Roles stored in AsyncStorage (local device storage) for first-time users
- **After Signup**: When user signs up, First Name, Last Name, Region, City, and User Roles from AsyncStorage are **automatically synced to MongoDB** (user profile) via NestJS backend
- **Update Frequency**: Name, location and roles can be changed anytime in settings
- **Validation**:
  - First Name and Last Name: Minimum 2 characters, maximum 50 characters
  - PSGC codes validated against official PSA database
- **Storage Priority**:
  - **Logged-in users**: Name, location and roles read from MongoDB user profile (synced from AsyncStorage on signup)
  - **Anonymous users**: Name, location and roles read from AsyncStorage only
  - **Name/Location/Role updates**: If logged in, update both MongoDB and AsyncStorage; if anonymous, update AsyncStorage only

**Completion:**

- First Name, Last Name, Region, City, and User Roles saved to AsyncStorage (local device storage)
- User redirected to dashboard
- Dashboard filters data based on selected location
- **On Signup**: First Name, Last Name, location values and user roles from AsyncStorage automatically sent to NestJS backend and stored in MongoDB user profile

---

### 2. 📊 Dashboard - Price Display

**Implementation**: Main dashboard showing aggregated price data for user's selected location

#### Top Section: Liveweight Price Display

The dashboard top section displays **two prominent numbers** side by side:

**1. Verified Trader Average Price**

- **Calculation**: Average of all liveweight prices submitted by "Verified Traders" in the user's selected Region and City
- **Color**: Primary color (emerald/green) to indicate verified/trusted data
- **Label**: "Verified Trader Average" or "Verified Price"
- **Update Frequency**: Real-time (updates when new verified trader prices are submitted)
- **Display Format**: `₱XXX.XX per kg` or `₱XXX.XX/kg`

**2. Unverified User Average Price**

- **Calculation**: Average of all liveweight prices submitted by unverified users in the user's selected Region and City
- **Color**: Secondary/muted color (gray/stone) to differentiate from verified data
- **Label**: "Unverified Average" or "Community Price"
- **Update Frequency**: Real-time (updates when new unverified prices are submitted)
- **Display Format**: `₱XXX.XX per kg` or `₱XXX.XX/kg`

**Visual Design:**

- Two large, prominent number displays
- Side-by-side layout (or stacked on mobile)
- Clear visual distinction between verified and unverified data
- Color coding for quick recognition
- Last updated timestamp displayed below numbers
- Sample size indicator (e.g., "Based on 15 verified inputs" / "Based on 42 community inputs")

**Data Aggregation Rules:**

- Only includes prices from the last 30 days (configurable)
- Excludes outliers (prices more than 2 standard deviations from mean)
- Minimum sample size: At least 1 price input required to display average
- If no data available: Display "No data available" message

---

### 3. 📋 Regional Price Table

**Implementation**: Comprehensive table showing price data for all regions in the Philippines

#### Table Structure

**Columns:**

1. **Region** - Philippine region name
2. **Verified Average** - Average price from verified traders (₱/kg)
3. **Unverified Average** - Average price from unverified users (₱/kg)
4. **Price Change** - Percentage change from previous period (optional, for future)
5. **Last Updated** - Timestamp of most recent price input

**Features:**

- **Sortable columns**: Click column header to sort (ascending/descending)
- **Default sort**: By region name (alphabetical)
- **Search/Filter**: Filter by region name
- **Empty states**: Show "No data" for regions without price inputs
- **Row highlighting**: Highlight user's selected region row
- **Clickable rows**: Tap to view detailed region breakdown (future feature)

**Data Display:**

- Real-time data from database
- Cached for 5 minutes to reduce API calls
- Pull-to-refresh to update manually
- Loading skeleton while fetching data

**Visual Design:**

- Clean, readable table layout
- Alternating row colors for readability
- Responsive design (horizontal scroll on mobile if needed)
- Color-coded price change indicators (green for increase, red for decrease)

---

### 4. 🔐 Optional Authentication

**Implementation**: NestJS backend with better-auth for authentication - signup is completely optional

#### Backend Architecture

- **Backend**: NestJS REST API
- **Authentication**: better-auth library (handles OAuth and session management)
- **Database**: MongoDB for all user data, price inputs, and verifications
- **Storage**: MongoDB GridFS or cloud storage (AWS S3, Cloudinary) for verification documents

#### Authentication Options

**Social Login:**

- **Google Login**: OAuth integration via better-auth
- **Facebook Login**: OAuth integration via better-auth
- **Email/Password**: Optional email registration (future)

**Anonymous Usage:**

- Users can use the app without signing up
- Location preference (Region and City) and User Roles stored in AsyncStorage only
- Can view all price data
- Cannot submit price inputs (requires registration)

**Registration Flow:**

1. User completes social login (Google/Facebook) via better-auth
2. **Name, Location and Roles Included in Signup**: First Name, Last Name, Region, City, and User Roles from AsyncStorage are automatically included in the signup submission to NestJS backend
3. NestJS backend creates user profile in MongoDB with:
   - User information from OAuth provider
   - First Name and Last Name from signup request (read from AsyncStorage)
   - Region and City from signup request (read from AsyncStorage)
   - User Roles (array: ['hog_raiser', 'public_market_seller', 'midman']) from signup request (read from AsyncStorage)
   - Default verification status: 'unverified'
4. User profile created with name, location and roles stored in MongoDB
5. User can now submit price inputs and access verification

**Registration Benefits:**

- Ability to submit price inputs
- Access to verification process (become Verified Trader)
- Location preference synced to MongoDB (accessible across devices when logged in)
- Personal price history tracking (future)
- Price alerts and notifications (future)

**User Profile (Optional):**

- Comprehensive profile screen with user information, submissions, and verification details
- See detailed profile specification in Section 7: User Profile
- **Name and Location Sync**: When logged in, name and location are read from MongoDB; when anonymous, read from AsyncStorage

---

### 5. 💰 Price Input Form

**Implementation**: Form for registered users to submit liveweight price data

#### Form Access

- **Requirement**: User must be registered and logged in
- **Location**: Accessible from dashboard (floating action button or "Submit Price" button)
- **Frequency**: Users can submit multiple times per day (no strict limit, but rate limiting applies)

#### Form Fields

**1. Location (Pre-filled)**

- Region: Auto-filled from user profile (MongoDB) if logged in, or AsyncStorage if anonymous
- City/Municipality: Auto-filled from user profile (MongoDB) if logged in, or AsyncStorage if anonymous
- **Editable**: User can change location if submitting for different area
- **Note**: For registered users, location is read from MongoDB user profile (synced from AsyncStorage on signup)

**2. Liveweight Price**

- **Input Type**: Number input (decimal allowed)
- **Unit**: Philippine Peso (₱) per kilogram
- **Validation**:
  - Required field
  - Minimum: ₱50.00/kg (reasonable minimum)
  - Maximum: ₱500.00/kg (reasonable maximum)
  - Decimal precision: 2 decimal places
- **Placeholder**: "Enter price per kilogram"

**3. Additional Information (Optional)**

- **Livestock Type**: Dropdown (Fattener / Piglet / Both)
- **Breed**: Text input (optional)
- **Notes**: Text area for additional context (optional)
- **Date Observed**: Date picker (defaults to today, can select past dates)

**4. Verification Status Indicator**

- Shows user's current verification status
- If verified: "Verified Trader" badge displayed
- If unverified: "Community Contributor" badge displayed

#### Form Submission

**Process:**

1. Validate all required fields
2. Submit to NestJS backend API
3. Backend stores data in MongoDB
4. Show success message
5. Update dashboard immediately (optimistic update)
6. Invalidate TanStack Query cache to refresh data

**Data Storage:**

- **Backend**: NestJS API stores price inputs in MongoDB
- Store price input with:
  - User ID (from better-auth session)
  - Verification status (verified/unverified) - fetched from user profile
  - Location (region, city) - from form input
  - Price value
  - Timestamp
  - Additional metadata (livestock type, breed, notes)

**Rate Limiting:**

- Maximum 10 submissions per hour per user
- Prevents spam and data manipulation
- Clear error message if limit exceeded

**Success Feedback:**

- Toast notification: "Price submitted successfully!"
- Dashboard updates automatically
- Form resets (ready for next submission)

---

### 6. ✅ Verification Process (Optional)

**Implementation**: Multi-step verification system to become a "Verified Trader"

#### Verification Access

- **Location**: Available in user profile/settings
- **Requirement**: User must be registered
- **Status**: Optional - users can remain unverified
- **Benefit**: Verified trader prices are displayed separately and trusted more

#### Verification Steps

**Step 1: SMS Verification**

- **Purpose**: Verify phone number ownership
- **Process**:
  1. User enters phone number (Philippine format: +63XXXXXXXXXX)
  2. NestJS backend sends OTP via SMS (using third-party SMS service like Twilio, Vonage, or local Philippine SMS provider)
  3. User enters OTP to verify
  4. Phone number stored and verified in MongoDB
- **Provider**: Third-party SMS service integrated with NestJS backend
- **Status**: Required for verification

**Step 2: Valid ID Upload**

- **Purpose**: Verify user identity
- **Process**:
  1. User uploads photo of valid government-issued ID
  2. Accepted IDs:
     - Philippine Driver's License
     - National ID (PhilSys)
     - Passport
     - Postal ID
     - TIN ID
     - SSS ID
     - Other government-issued IDs
  3. Image uploaded to NestJS backend, stored in MongoDB GridFS or cloud storage (AWS S3, Cloudinary)
  4. Manual review process (admin reviews and approves via admin dashboard)
- **File Requirements**:
  - Image format: JPG, PNG
  - Max file size: 5MB
  - Must be clear and readable
- **Status**: Required for verification
- **Privacy**: ID images stored securely in MongoDB/cloud storage, only accessible by admins

**Step 3: Business Permit Upload (Optional but Recommended)**

- **Purpose**: Verify business legitimacy
- **Process**:
  1. User uploads business permit or registration document
  2. Document uploaded to NestJS backend, stored in MongoDB GridFS or cloud storage (AWS S3, Cloudinary)
  3. Manual review process (admin reviews and approves via admin dashboard)
- **File Requirements**:
  - Image format: JPG, PNG, PDF
  - Max file size: 10MB
  - Must be clear and readable
- **Status**: Optional but recommended (may be required for certain features in future)
- **Privacy**: Documents stored securely in MongoDB/cloud storage, only accessible by admins

#### Verification Review Process

**Admin Review:**

- Admins review submitted documents in admin dashboard
- Review criteria:
  - ID is valid and matches user profile
  - Business permit is legitimate (if submitted)
  - Documents are clear and readable
- Approval/Rejection:
  - Approve: User becomes "Verified Trader"
  - Reject: User notified with reason, can resubmit

**Verification Status:**

- **Pending**: Documents submitted, awaiting review
- **Verified**: All checks passed, user is Verified Trader
- **Rejected**: Documents rejected, user can resubmit
- **Unverified**: No verification submitted

**Verification Badge:**

- Verified traders see "Verified Trader" badge on profile
- Verified trader prices marked with verification badge in price inputs
- Visual distinction in dashboard (verified vs unverified averages)

**Verification Benefits:**

- Prices included in "Verified Trader Average" calculation
- Higher trust and visibility in community
- Potential future benefits (badges, priority support, etc.)

---

### 7. 👤 User Profile

**Implementation**: Profile screen where users can view their information, submissions, and verification details

#### Profile Access

- **Location**: Accessible from navigation menu or profile icon
- **Requirement**: User must be registered and logged in
- **Anonymous Users**: Cannot access profile (prompted to sign up)

#### Profile Sections

**1. User Information**

- **First Name**: Editable first name
  - Display current first name from MongoDB
  - Allow user to update first name
  - Update syncs to both MongoDB and AsyncStorage
- **Last Name**: Editable last name
  - Display current last name from MongoDB
  - Allow user to update last name
  - Update syncs to both MongoDB and AsyncStorage
- **Display Name**: Editable display name (what other users see) - can be auto-generated from first name and last name
- **Email**: Email address from OAuth provider (read-only, if available)
- **Profile Picture**: Profile image from OAuth provider (Google/Facebook)
- **Location**: Region and City (editable)
  - Display current region and city from MongoDB
  - Allow user to update location
  - Update syncs to both MongoDB and AsyncStorage
- **User Roles**: Display selected roles (editable)
  - Show checkboxes for: Hog Raiser, Public Market Seller, Midman
  - Display current roles from MongoDB
  - Allow user to update roles (can select multiple/all)
  - Update syncs to both MongoDB and AsyncStorage
- **Verification Status Badge**:
  - **Unverified**: "Community Contributor" badge
  - **Pending**: "Verification Pending" badge with pending indicator
  - **Verified**: "Verified Trader" badge (prominent, primary color)
  - **Rejected**: "Verification Rejected" badge with option to resubmit

**2. Price Submission History**

- **List View**: Display all price inputs submitted by the user
- **Sort Options**:
  - Most recent first (default)
  - Oldest first
  - By price (highest/lowest)
  - By location
- **Filter Options**:
  - By region
  - By city
  - By date range
  - By livestock type
- **Submission Card Display**:
  - Price per kg (₱XXX.XX/kg)
  - Location (Region, City)
  - Livestock type (if specified)
  - Date submitted
  - Verification status indicator (if verified at time of submission)
- **Empty State**: "No submissions yet" message with link to submit price
- **Pagination**: Load more submissions (20 per page)

**3. Verification Details (Only for Verified Users)**

This section is **only visible** if the user's verification status is "verified":

- **Phone Number**:
  - Display verified phone number (masked for privacy: +63**\***XXXX)
  - Show verification date
  - "Verified" badge next to phone number

- **Valid ID**:
  - Display thumbnail/preview of uploaded valid ID
  - Show ID type (e.g., "Philippine Driver's License")
  - Show verification date
  - "Verified" badge
  - Tap to view full-size image (modal/zoom view)
  - Privacy note: "This document is securely stored and only visible to you"

- **Business Permit** (if submitted):
  - Display thumbnail/preview of uploaded business permit
  - Show verification date
  - "Verified" badge
  - Tap to view full-size document (modal/zoom view)
  - Privacy note: "This document is securely stored and only visible to you"

- **Verification Summary**:
  - Overall verification status: "Verified Trader"
  - Verification date (when all checks were completed)
  - Admin review information (if applicable)

**4. Verification Status (For Unverified/Pending Users)**

If user is not verified or verification is pending:

- **Current Status**: Display current verification status
- **Action Button**: "Start Verification" or "Complete Verification"
  - Links to verification flow
  - Shows progress if partially completed
- **Verification Checklist**:
  - ☐ SMS Verification (phone number)
  - ☐ Valid ID Upload
  - ☐ Business Permit Upload (optional)
  - Shows checkmarks for completed steps

#### Profile Actions

**Editable Fields:**

- First Name (edit inline or via modal)
- Last Name (edit inline or via modal)
- Display name (edit inline or via modal)
- Location (Region and City) - opens location selection
- User Roles (Hog Raiser, Public Market Seller, Midman) - checkbox selection, can select multiple/all
- Profile picture (future: allow upload)

**Actions:**

- **Edit Profile**: Opens edit mode for editable fields
- **View Submissions**: Navigate to detailed submission history
- **Start/Continue Verification**: Navigate to verification flow
- **Sign Out**: Logout from account
- **Delete Account**: Future feature (with confirmation)

#### Profile Data Fetching

- **User Info**: Fetched from MongoDB via `GET /api/users/profile`
- **Submissions**: Fetched via `GET /api/users/submissions` with pagination
- **Verification Details**: Fetched via `GET /api/verification/status` (includes document URLs)
- **Document Images**: Loaded from MongoDB GridFS or cloud storage URLs

#### Privacy & Security

- **Document Visibility**: Only the user can see their own verification documents
- **Phone Number Masking**: Display masked phone number (last 4 digits visible)
- **Secure Document Access**: Document URLs require authentication token
- **Data Privacy**: All personal information stored securely in MongoDB

#### UI/UX Design

- **Layout**: Scrollable profile with sections
- **Header**: Profile picture, name, verification badge
- **Sections**: Card-based layout for each section
- **Loading States**: Skeleton loading for profile data
- **Empty States**: Friendly messages for no submissions
- **Verification Badge**: Prominent display for verified traders
- **Document Thumbnails**: Small preview images with tap-to-view-full functionality

---

## 🗄️ Database Schema (MongoDB)

**Database**: MongoDB  
**ODM/ORM**: Mongoose or TypeORM (for NestJS)

### Price Inputs Collection

```typescript
interface PriceInput {
  _id: ObjectId;
  userId?: ObjectId; // Reference to User, nullable (for anonymous submissions - future)
  verificationStatus: 'verified' | 'unverified'; // Derived from user's verification status
  region: string;
  city: string;
  pricePerKg: number; // Decimal stored as number (MongoDB supports Decimal128 for precision)
  livestockType?: 'fattener' | 'piglet' | 'both';
  breed?: string;
  notes?: string;
  dateObserved: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Users Collection (better-auth managed + custom fields)

```typescript
interface User {
  _id: ObjectId;
  // better-auth managed fields
  email?: string;
  name?: string;
  emailVerified?: boolean;
  image?: string;
  // Custom fields
  firstName?: string; // Synced from AsyncStorage on signup
  lastName?: string; // Synced from AsyncStorage on signup
  displayName?: string;
  region?: string; // Synced from AsyncStorage on signup
  city?: string; // Synced from AsyncStorage on signup
  userRoles?: ('hog_raiser' | 'public_market_seller' | 'midman')[]; // Synced from AsyncStorage on signup, can select multiple
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
```

### User Verification Collection

```typescript
interface UserVerification {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  phoneNumber?: string;
  phoneVerified: boolean;
  phoneVerifiedAt?: Date;
  validIdUrl?: string; // URL to stored file (GridFS or cloud storage)
  validIdVerifiedAt?: Date;
  businessPermitUrl?: string; // URL to stored file (GridFS or cloud storage)
  businessPermitVerifiedAt?: Date;
  status: 'pending' | 'verified' | 'rejected';
  reviewedBy?: ObjectId; // Reference to Admin User
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Location Storage Strategy

**Dual Storage Approach:**

1. **AsyncStorage (Local Device)**:
   - Used for anonymous users
   - Used as initial storage for first-time users
   - Synced to MongoDB when user signs up

2. **MongoDB (User Profile)**:
   - Stored in User collection (`region` and `city` fields)
   - Automatically synced from AsyncStorage on signup
   - Used for logged-in users (read from MongoDB)
   - Can be updated in user profile settings

**Local Storage (AsyncStorage):**

```typescript
interface LocationPreference {
  firstName: string;
  lastName: string;
  region: string;
  city: string;
  userRoles: ('hog_raiser' | 'public_market_seller' | 'midman')[]; // Array of selected roles
  lastUpdated: number; // timestamp
}
```

**MongoDB Storage:**

First name, last name, location and user roles are stored in the `User` collection (see Users Collection schema above) with `firstName`, `lastName`, `region`, `city`, and `userRoles` fields.

---

## 🎨 UI/UX Design Guidelines

### Color Scheme

- **Verified Trader Price**: Primary color (emerald/green) - `bg-primary`, `text-primary-foreground`
- **Unverified Price**: Secondary/muted color (gray/stone) - `bg-muted`, `text-muted-foreground`
- **Dashboard Background**: Light background - `bg-background`
- **Table**: Card-based design with borders - `bg-card`, `border-border`

### Typography

- **Price Numbers**: Large, bold font (2xl or 3xl)
- **Labels**: Medium font with muted color
- **Table Text**: Regular font size, readable

### Component Usage

- **Location Selection**: Use `Select` component for dropdowns
- **Price Input Form**: Use `Input` component with number type
- **Dashboard Cards**: Use `Card` component for price displays
- **Table**: Custom table component or `ScrollView` with styled rows
- **Verification Upload**: Use file upload component with image preview
- **Loading States**: Use `Loading` component with skeleton variant

---

## 📱 Screen Flow

### Anonymous User Flow

1. **App Launch** → Location Selection (Region + City)
2. **Dashboard** → View prices (verified + unverified averages)
3. **Regional Table** → View all region prices
4. **Optional Signup** → Register to submit prices

### Registered User Flow

1. **App Launch** → Location Selection (if not set) OR Dashboard (if location exists)
2. **Dashboard** → View prices + "Submit Price" button
3. **Price Input Form** → Submit liveweight price
4. **Profile Screen** → View user info, submissions, verification details
5. **Profile/Settings** → Access verification process (if not verified)
6. **Verification Flow** → Complete SMS, ID, Business Permit steps
7. **Profile Screen (Verified)** → View verified documents (ID, business permit, phone number)

---

## 🔒 Security & Privacy

### Data Privacy

- **Anonymous Users**: Name (First Name and Last Name) and location preference (Region and City) stored locally in AsyncStorage only - NOT sent to backend
- **User Data**: Personal information stored securely in MongoDB (via NestJS backend)
- **Verification Documents**: Stored in MongoDB GridFS or cloud storage (AWS S3, Cloudinary), accessible only by admins
- **Price Data**: Aggregated and anonymized for public display
- **Name and Location Privacy**: First Name, Last Name, Region and City selections remain on device, never synced to backend until user signs up

### Rate Limiting

- **Price Submissions**: 10 submissions per hour per user
- **SMS Verification**: 3 OTP requests per day per phone number
- **API Calls**: Standard rate limiting on all endpoints

### Data Validation

- **Price Inputs**: Validate price range, location, required fields
- **File Uploads**: Validate file type, size, format
- **Location Data**: Validate against PSGC database

---

## 🚀 Future Enhancements (Post-MVP)

- Price trends and charts (historical data visualization)
- Price alerts and notifications
- Detailed region/city breakdown pages
- Price comparison tools
- User price submission history
- Admin dashboard for verification review
- Price prediction/forecasting
- Integration with market data APIs
- Multi-livestock support (cattle, goats, etc.)

---

## 📊 Success Metrics

### Key Performance Indicators (KPIs)

- **User Engagement**: Daily active users, location selections
- **Data Quality**: Number of price inputs per day, verified vs unverified ratio
- **Verification Rate**: Percentage of registered users who complete verification
- **Data Coverage**: Number of regions/cities with price data
- **User Retention**: Return users, weekly/monthly active users

### Data Quality Metrics

- **Price Input Frequency**: Average submissions per user
- **Geographic Coverage**: Percentage of Philippine regions with data
- **Verification Adoption**: Number of verified traders
- **Data Freshness**: Average age of price inputs in dashboard

---

## 🛠️ Technical Implementation Notes

### Backend Architecture

**Technology Stack:**

- **Framework**: NestJS (Node.js)
- **Authentication**: better-auth library (handles OAuth, sessions, user management)
- **Database**: MongoDB (stores users, price inputs, verifications)
- **File Storage**: MongoDB GridFS or cloud storage (AWS S3, Cloudinary) for verification documents
- **SMS Service**: Third-party provider (Twilio, Vonage, or local Philippine SMS provider)

**Data Storage Strategy:**

- **Backend (MongoDB)**: User accounts (including first name, last name, region, city, and user roles), price inputs, verification data, verification documents
- **Local Device (AsyncStorage)**: First Name, Last Name, Region, City, and User Roles selection for anonymous users; synced to MongoDB on signup
- **Name, Location & Roles Sync Flow**:
  - First-time users: First Name/Last Name/Region/City/User Roles stored in AsyncStorage
  - On signup: First Name/Last Name/Region/City/User Roles from AsyncStorage included in signup request body → Stored in MongoDB user profile
  - Logged-in users: Name, location and roles read from MongoDB; updates sync to both MongoDB and AsyncStorage
  - Anonymous users: Name, location and roles read from AsyncStorage only
- **Session Management**: better-auth handles authentication sessions (cookies/tokens)

**API Communication:**

- React Native app communicates with NestJS REST API
- All price data, user data, and verifications go through NestJS backend
- Location data included in signup request; stored in MongoDB user profile on signup

### Frontend State Management

- **Name, Location Preference & User Roles**:
  - Anonymous users: AsyncStorage only (firstName, lastName, region, city, userRoles)
  - Registered users: MongoDB (synced from AsyncStorage on signup), with AsyncStorage as fallback
  - On signup: First name, last name, location and user roles from AsyncStorage automatically sent to NestJS backend
- **Price Data**: TanStack Query for all server requests to NestJS API
- **Form State**: TanStack Form for price input form
- **UI State**: Zustand for global UI state (theme, modals)
- **Authentication State**: better-auth client-side session management

### API Endpoints (NestJS Backend)

**Price Endpoints:**

- `GET /api/prices/aggregated?region={region}&city={city}` - Get verified/unverified averages
- `GET /api/prices/regional` - Get all region prices
- `POST /api/prices/submit` - Submit new price input (requires authentication)

**Authentication Endpoints (better-auth):**

- `POST /api/auth/signin/google` - Google OAuth login (includes firstName, lastName, region and city from AsyncStorage in request body)
- `POST /api/auth/signin/facebook` - Facebook OAuth login (includes firstName, lastName, region and city from AsyncStorage in request body)
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

**Verification Endpoints:**

- `GET /api/verification/status` - Get user verification status (includes document URLs for verified users)
- `POST /api/verification/submit` - Submit verification documents (ID, business permit)
- `POST /api/verification/sms/send` - Send SMS OTP
- `POST /api/verification/sms/verify` - Verify SMS OTP
- `GET /api/verification/documents/:type` - Get verification document (ID or business permit) - requires authentication

**User Endpoints:**

- `GET /api/users/profile` - Get user profile (includes firstName, lastName, region, city, userRoles, display name, verification status)
- `PATCH /api/users/profile` - Update user profile (can update firstName, lastName, display name, region, city, userRoles)
- `GET /api/users/submissions` - Get user's price submission history (with pagination, sorting, filtering)
- `GET /api/users/submissions/:id` - Get specific submission details

### Caching Strategy

- **Price Aggregations**: Cache for 5 minutes (TanStack Query)
- **Regional Table**: Cache for 5 minutes (TanStack Query)
- **Location Data**:
  - Anonymous users: Stored in AsyncStorage (no backend caching needed)
  - Registered users: Stored in MongoDB, cached via TanStack Query until logout or manual refresh
- **User Profile**: Cache until logout or manual refresh (TanStack Query) - includes region and city
- **User Submissions**: Cache for 2 minutes (TanStack Query) - refreshes after new submission
- **Verification Details**: Cache until logout or manual refresh (TanStack Query)
- **Session**: Managed by better-auth (cookies/tokens)

### Data Flow

1. **Name, Location & Role Selection**: User enters First Name/Last Name and selects Region/City and User Roles → Stored in AsyncStorage → Used for API queries
2. **Signup with Name, Location & Roles**: User signs up → First Name/Last Name/Region/City/User Roles from AsyncStorage included in signup request → better-auth creates session → NestJS backend receives name, location and roles in signup payload → Stored in MongoDB user profile
3. **Price Submission**: User submits price → NestJS API → MongoDB → Aggregation updates
4. **Authentication**: User logs in → better-auth → NestJS session → MongoDB user record (with firstName/lastName/region/city/userRoles)
5. **Verification**: User uploads documents → NestJS API → MongoDB/GridFS → Admin review
6. **Profile View**: User views profile → NestJS API → MongoDB (user info, submissions, verification details, user roles)
7. **Name, Location & Role Updates**: If logged in, update both MongoDB and AsyncStorage; if anonymous, update AsyncStorage only

---

## 📝 Development Priorities

### Phase 1: Core MVP

1. Location selection flow
2. Dashboard with two price displays
3. Regional price table
4. Basic price input form (registered users only)

### Phase 2: Authentication & Verification

1. Optional social login (Google, Facebook)
2. User profile screen (user info, submissions)
3. SMS verification
4. Valid ID upload
5. Business permit upload
6. Verification details display in profile (for verified users)
7. Admin review system

### Phase 3: Polish & Optimization

1. Data validation and error handling
2. Rate limiting
3. Performance optimization
4. UI/UX refinements
5. Testing and bug fixes

---

## 🎯 MVP Success Criteria

The MVP is considered successful when:

- ✅ Users can select location and view price data
- ✅ Dashboard displays verified and unverified price averages
- ✅ Regional price table shows data for all Philippine regions
- ✅ Registered users can submit price inputs
- ✅ User profile displays user info, submissions, and verification details
- ✅ Verified users can view their verified documents (ID, business permit, phone number)
- ✅ Verification process is functional (SMS, ID, Business Permit)
- ✅ Verified traders' prices are calculated separately
- ✅ App is stable and performant
- ✅ Data is accurate and up-to-date

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-XX  
**Status**: MVP Specification - Ready for Development
