# Firebase Security Rules for TravelAI Project

## Firestore Database Rules

### Option 1: Development/Test Mode (Open Access)
**⚠️ WARNING: Only use during development - NOT for production!**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Option 2: Production Mode (Secure Access)
**✅ RECOMMENDED: Use this for production deployment**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own itineraries
    match /itineraries/{itineraryId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own travel history
    match /travelHistory/{historyId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Public read access for app configuration/settings
    match /appConfig/{document} {
      allow read: if true;
      allow write: if false; // Only admins can write (set via Firebase Console)
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Option 3: Enhanced Security with Validation
**🔒 MOST SECURE: Includes data validation**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidUser() {
      return request.resource.data.keys().hasAll(['email', 'displayName', 'createdAt']) &&
             request.resource.data.email is string &&
             request.resource.data.displayName is string &&
             request.resource.data.createdAt is timestamp;
    }
    
    function isValidItinerary() {
      return request.resource.data.keys().hasAll(['destination', 'userId', 'createdAt']) &&
             request.resource.data.destination is string &&
             request.resource.data.userId is string &&
             request.resource.data.createdAt is timestamp;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow create: if isAuthenticated() && isOwner(userId) && isValidUser();
      allow update: if isAuthenticated() && isOwner(userId) && isValidUser();
      allow delete: if isAuthenticated() && isOwner(userId);
    }
    
    // Itineraries collection
    match /itineraries/{itineraryId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
        isOwner(request.resource.data.userId) && 
        isValidItinerary();
      allow update: if isAuthenticated() && 
        isOwner(resource.data.userId) && 
        isValidItinerary();
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
    
    // Travel history collection
    match /travelHistory/{historyId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
        isOwner(request.resource.data.userId);
      allow update: if isAuthenticated() && isOwner(resource.data.userId);
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
    
    // Public collections (read-only)
    match /destinations/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    match /appConfig/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Firebase Storage Rules

### For User Profile Pictures and Trip Images

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own profile pictures
    match /users/{userId}/profile/{allPaths=**} {
      allow read: if true; // Profile pictures can be public
      allow write: if request.auth != null && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024 // 5MB limit
        && request.resource.contentType.matches('image/.*');
    }
    
    // Users can upload images for their itineraries
    match /itineraries/{userId}/{itineraryId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId
        && request.resource.size < 10 * 1024 * 1024 // 10MB limit
        && request.resource.contentType.matches('image/.*');
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Apply These Rules

### 1. For Firestore Database:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `vacation-project-edec5`
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with one of the options above
6. Click **Publish**

### 2. For Firebase Storage:
1. In Firebase Console, click on **Storage** in the left sidebar
2. Click on the **Rules** tab
3. Replace the existing rules with the storage rules above
4. Click **Publish**

## Recommended Setup Process

### Phase 1: Development (Use Option 1)
```javascript
// Simple test mode for development
allow read, write: if true;
```

### Phase 2: Testing (Use Option 2)
```javascript
// Basic authentication required
allow read, write: if request.auth != null && request.auth.uid == userId;
```

### Phase 3: Production (Use Option 3)
```javascript
// Full security with validation
// Use the enhanced security rules with data validation
```

## Important Notes

### 🔐 Security Best Practices:
- **Never use test mode in production**
- **Always validate user ownership**
- **Limit file sizes for uploads**
- **Validate data types and required fields**
- **Use helper functions for cleaner code**

### 📊 Data Structure Recommendations:
```javascript
// User document structure
{
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  createdAt: timestamp,
  lastLogin: timestamp
}

// Itinerary document structure
{
  userId: "user-uid-here",
  destination: "Paris, France",
  startDate: "2024-01-15",
  endDate: "2024-01-22",
  budget: 3000,
  itinerary: [...],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 🧪 Testing Your Rules:
1. Use Firebase Console **Rules Playground**
2. Test with different user scenarios
3. Verify unauthorized access is blocked
4. Check that authorized users can access their data

Choose the option that best fits your current development phase and security requirements!
