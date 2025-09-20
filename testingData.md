# Doctor Appointment Backend

This file contains sample user data for testing and development purposes.

## Run seed script

```bash
npm run prisma:seed:dev
```

## First create users

```json
[
  {
    "name": "Masuma",
    "email": "masuma@example.com",
    "gender": "FEMALE",
    "phone": "01860754544",
    "password": "123456"
  },
  {
    "name": "Ismot Ara",
    "email": "ismotara@example.com",
    "gender": "FEMALE",
    "phone": "01860754544",
    "password": "123456"
  },
  {
    "name": "Rafik Uddin",
    "email": "rafikuddin@example.com",
    "gender": "MALE",
    "phone": "01723141338",
    "password": "123456"
  }
]
```

note:

- Update role you have to use admin authentication
- Create clinic in clinic table only superAdmin&admin has access to create clinic
- Create doctor or nurse in doctor or nurse table

## Than update role of users

```json
{
  "role": "NURSE/DOCTOR"
}
```

## Clinics

```json
[
  {
    "name": "Popular Diagnostic Centre Ltd",
    "address": "Mohakhali, Dhaka"
  },
  {
    "name": "Popular Diagnostic Centre Ltd",
    "address": "Laxmipur, Rajshahi"
  },
  {
    "name": "Popular Diagnostic Centre Ltd",
    "address": "Chadpur, Chittagong"
  }
]
```

note:
- Update doctor and nurse profile
- Assign doctor and nurse to the clinic
- Create schedule for doctor visit

## Nurse profile

```json
{
  "licenseNumber": "a10567"
}
```

## Doctor profile

```json
{
  "specialty": "SURGERY",
  "licenseNumber": "S10567"
}
```

## Assign nurse and doctor to clinic

```json
{
  "clinicId": "input clinic id",
  "nurseId": "input nurse id"
}
{
  "clinicId": "input clinic id",
  "doctorId": "input doctor id"
}

```


## Create schedule for doctor visit
```json
[
  {
    "clinicId": "input clinic id",
    "doctorId": "input doctor id",
    "date": "2025-10-22",
    "startTime": "16:00",
    "endTime": "22:00",
    "dayOfWeek": ["SATURDAY", "MONDAY", "WEDNESDAY"]
  }
]
```
