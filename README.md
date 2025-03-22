# bank-teller-system

A Node.js + TypeScript application สำหรับระบบ Bank Teller สร้างด้วย Clean Architecture ที่สามารถทำธุรกรรมฝาก ถอน และโอนเงินได้ ระบบมีการทำงานดังนี้

1. ฝากเงินเข้าบัญชี
2. ถอนเงินจากบ้ญชี
3. โอนเงินระหว่างบัญชี

## Tools

- Nodejs (Express) + TypeScript
- PostgreSQL + TypeORM lib

## Authentication & Authorization

จัดการการตรวจสอบสิทธิ์ในระบบด้วยการสร้างตาราง User สำหรับเก็บข้อมูล Username, Hashed password

- **Authentication** มีการเพิ่ม Endpoint สำหรับ Login และ Register
  - JWT ในการ Verify bearer token ที่ส่งผ่าน Header
  - bcrypt สำหรับ Hash password
- **Authorization** แบบ Role-Based
  - สร้าง Middleware สำหรับ Check role เช่น Admin

## Error handling & Logging

การจัดการข้อผิดพลาดของระบบมีดังต่อไปนี้

- **Input Validation** สำหรับตรวสอบ request และแจ้งเตือนไปยัง Client ได้
- **Custom Error** สำหรับแยก Business Error เช่น Invalid data, Insufficient Balance
- **Global Error Middleware** สำหรับจัดการ Format ของ Error ก่อนที่จะคืนไปให้ Client
- **Request Logging** สำหรับแสดงรายละเอียด Request เช่น Response time, Status Code หรือ Error ต่าง ๆ

## How to test the API

การทดสอบ API ที่สร้างขึ้นสามารถทำได้ดังต่อไปนี้

1. **Unit Tests** ใช้ Jest ในการทดสอบ function ย่อยๆ ในทีนี้ทดสอบเฉพาะ Usecase

   - Mock repository (Database)
   - แยกจาก controller

2. **Integration Tests** ใช้ Supertest ในการทดสอบ flow ต่างๆ เช่น การทำรายการฝาก 1 รายการเพื่อโอนไป 2 บัญชี

   - ทดสอบโดยการต่อ Database
   - มีการเรียก request ผ่าน controller

3. **Postman** เป็น tool สำหรับทดสอบ Call API
   - สร้าง request สำหรับทดสอบแต่ละ endpoint

## Api Endpoints

#### Transaction

- ฝากเงินเข้าบัญชี - POST `/deposit`
- ถอนเงินจากบัญชี - POST `/withdraw`
- โอนเงินระหว่างบัญชี - POST `/transfer`

#### Auth

- Register สำหรับเจ้าหน้าที่ – POST `/auth/register`
- Login สำหรับเจ้าหน้าที่ – POST `/auth/login`

#### Account

- เพิ่มบัญชีเงินฝาก - POST `/account`

## Architecture

โครงสร้างของ API มีพื้นฐานมาจาก **Clean Architecture** โดยแบ่งเป็น Layer เพื่อการดูแลรักษาที่ดี (Maintainability) และเพื่อการทดสอบที่ดี (Testability)

- Domain --> Model หลักในระบบเช่น Account, Customer และ Business Error เป็นต้น
- Use Cases --> Logic การทำงานของระบบ เช่น การฝาก ถอนและ โอนเงิน เป็นต้น
- Infrastructure --> การจัดการ Request/Response, Connect Database และอื่นๆ
