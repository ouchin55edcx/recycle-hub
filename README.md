# RecycleHub - Waste Collection Management Platform

## Overview
RecycleHub is a modern web application that connects individuals (particuliers) with waste collectors to facilitate recycling and promote environmental sustainability. The platform rewards users with points for their recycling efforts, which can be converted into vouchers.

## Features

### For Individuals (Particuliers)
- Create and manage recycling collection requests
- Track collection status in real-time
- Earn points based on recycling contributions:
  - Plastic: 2 points/kg
  - Glass: 3 points/kg
  - Paper: 1 point/kg
  - Metal: 4 points/kg
- Convert points to vouchers:
  - 100 points = 50 DH voucher
  - 200 points = 120 DH voucher
  - 500 points = 350 DH voucher
- View collection history and points balance

### For Collectors
- View and manage collection requests
- Update collection status
- Validate collected materials
- Record actual weights and material types
- Process collection verifications



## Usage Example

### Individual User Flow
1. Register/Login as a particulier
2. Create a collection request:
   ```typescript
   // Example collection request
   {
     "types": ["plastic", "glass"],
     "weight": 5000, // in grams
     "address": "123 Recycling St",
     "requestDate": "2024-02-15",
     "collectionTime": "10:00"
   }
   ```

3. Track request status
4. Receive points after validation
5. Convert points to vouchers

### Collector Flow
1. Login as a collector
2. View assigned collections
3. Process collection:
   ```typescript
   // Example collection validation
   {
     "status": "validated",
     "actualWeight": 4800,
     "verificationDetails": {
       "materialVerified": true,
       "sortingCorrect": true,
       "verificationNotes": "Well sorted materials"
     }
   }
   ```


## Points System
- Points are automatically awarded after collection validation
- Points calculation is based on material type and weight
- Real-time points balance updates
- Secure points-to-voucher conversion
- Transaction history tracking



## Acknowledgments
- Angular team for the fantastic framework
- TailwindCSS for the utility-first CSS framework
- JSON Server for the mock backend capabilities

