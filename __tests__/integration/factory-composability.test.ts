import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { setupTestDatabase, cleanupTestDatabase, withTestTransaction } from '../helpers/db'
import { createTestUser, createTestGig, createTestApplication, createTestMessage } from '../helpers/seed'
import { PrismaClient } from '@prisma/client'

describe('Factory Composability Examples', () => {
  let prisma: PrismaClient

  beforeAll(async () => {
    prisma = await setupTestDatabase()
  })

  afterAll(async () => {
    await cleanupTestDatabase(prisma)
  })

  it('creates gig with multiple applications', async () => {
    await withTestTransaction(async (tx) => {
      // Create one gig
      const gig = await createTestGig(tx)

      // Create 3 applications with same gigId but different specialists
      const app1 = await createTestApplication(tx, { gigId: gig.id })
      const app2 = await createTestApplication(tx, { gigId: gig.id })
      const app3 = await createTestApplication(tx, { gigId: gig.id })

      // Verify all applications linked to same gig
      expect(app1.gigId).toBe(gig.id)
      expect(app2.gigId).toBe(gig.id)
      expect(app3.gigId).toBe(gig.id)

      // Verify each application has different specialist
      expect(app1.specialistId).not.toBe(app2.specialistId)
      expect(app2.specialistId).not.toBe(app3.specialistId)
      expect(app1.specialistId).not.toBe(app3.specialistId)

      // Verify all applications have Russian content
      expect(app1.approach.length).toBeGreaterThan(100)
      expect(app2.questions.length).toBeGreaterThan(50)
      expect(app3.estimatedEffort.length).toBeGreaterThan(0)
    })
  })

  it('creates complete gig workflow with Russian data', async () => {
    await withTestTransaction(async (tx) => {
      // 1. Create client user
      const client = await createTestUser(tx, { role: 'CLIENT' })
      expect(client.role).toBe('CLIENT')
      expect(client.clientProfile?.companyName).toMatch(/ООО/)

      // 2. Create gig with clientId
      const gig = await createTestGig(tx, { clientId: client.id })
      expect(gig.clientId).toBe(client.id)
      expect(gig.title).toBeTruthy()
      expect(gig.status).toBe('OPEN')

      // 3. Create specialist user
      const specialist = await createTestUser(tx, { role: 'SPECIALIST' })
      expect(specialist.role).toBe('SPECIALIST')
      expect(specialist.specialistProfile?.displayName).toBeTruthy()

      // 4. Create application with gigId and specialistId
      const application = await createTestApplication(tx, {
        gigId: gig.id,
        specialistId: specialist.id
      })
      expect(application.gigId).toBe(gig.id)
      expect(application.specialistId).toBe(specialist.id)
      expect(application.status).toBe('PENDING')

      // 5. Accept application (update gig status to IN_PROGRESS)
      const updatedGig = await tx.gig.update({
        where: { id: gig.id },
        data: {
          status: 'IN_PROGRESS',
          assignedSpecialistId: specialist.id
        }
      })
      expect(updatedGig.status).toBe('IN_PROGRESS')
      expect(updatedGig.assignedSpecialistId).toBe(specialist.id)

      // 6. Create messages between client and specialist
      const clientMessage = await createTestMessage(tx, {
        gigId: gig.id,
        senderId: client.id
      })
      expect(clientMessage.senderId).toBe(client.id)
      expect(clientMessage.content).toBeTruthy()

      const specialistMessage = await createTestMessage(tx, {
        gigId: gig.id,
        senderId: specialist.id
      })
      expect(specialistMessage.senderId).toBe(specialist.id)

      // Verify entire workflow has Russian data
      expect(gig.title).toMatch(/[А-Яа-я]/) // Contains Cyrillic
      expect(application.approach).toMatch(/[А-Яа-я]/)
      expect(clientMessage.content).toMatch(/[А-Яа-я]/)
    })
  })

  it('creates message conversation with ordered messages', async () => {
    await withTestTransaction(async (tx) => {
      // Create client and specialist
      const client = await createTestUser(tx, { role: 'CLIENT' })
      const specialist = await createTestUser(tx, { role: 'SPECIALIST' })

      // Create gig with assigned specialist
      const gig = await createTestGig(tx, {
        clientId: client.id,
        assignedSpecialistId: specialist.id,
        status: 'IN_PROGRESS'
      })

      // Create 5 messages alternating between client and specialist
      const msg1 = await createTestMessage(tx, {
        gigId: gig.id,
        senderId: client.id,
        content: 'Добрый день! Когда планируете начать работу?'
      })

      const msg2 = await createTestMessage(tx, {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Здравствуйте! Начну сегодня вечером.'
      })

      const msg3 = await createTestMessage(tx, {
        gigId: gig.id,
        senderId: client.id,
        content: 'Отлично, жду результатов.'
      })

      const msg4 = await createTestMessage(tx, {
        gigId: gig.id,
        senderId: specialist.id,
        content: 'Первая версия готова, можете посмотреть.'
      })

      const msg5 = await createTestMessage(tx, {
        gigId: gig.id,
        senderId: client.id,
        content: 'Спасибо, проверю и дам обратную связь.'
      })

      // Fetch all messages for the gig
      const messages = await tx.message.findMany({
        where: { gigId: gig.id },
        orderBy: { createdAt: 'asc' }
      })

      // Verify messages are ordered by createdAt
      expect(messages).toHaveLength(5)
      expect(messages[0].id).toBe(msg1.id)
      expect(messages[1].id).toBe(msg2.id)
      expect(messages[2].id).toBe(msg3.id)
      expect(messages[3].id).toBe(msg4.id)
      expect(messages[4].id).toBe(msg5.id)

      // Verify alternating senders
      expect(messages[0].senderId).toBe(client.id)
      expect(messages[1].senderId).toBe(specialist.id)
      expect(messages[2].senderId).toBe(client.id)
      expect(messages[3].senderId).toBe(specialist.id)
      expect(messages[4].senderId).toBe(client.id)
    })
  })

  it('demonstrates factory override patterns', async () => {
    await withTestTransaction(async (tx) => {
      // Create user with custom values
      const customUser = await createTestUser(tx, {
        role: 'SPECIALIST',
        displayName: 'Иван Тестовый',
        techStack: 'Python, Django, PostgreSQL',
        experienceLevel: 'MIDDLE'
      })
      expect(customUser.specialistProfile?.displayName).toBe('Иван Тестовый')
      expect(customUser.specialistProfile?.techStack).toBe('Python, Django, PostgreSQL')
      expect(customUser.specialistProfile?.experienceLevel).toBe('MIDDLE')

      // Create gig with custom budget
      const customGig = await createTestGig(tx, {
        title: 'Кастомный проект',
        budget: 200000,
        serviceFee: 20000,
        totalAmount: 220000
      })
      expect(customGig.title).toBe('Кастомный проект')
      expect(customGig.budget).toBe(200000)
      expect(customGig.serviceFee).toBe(20000)
      expect(customGig.totalAmount).toBe(220000)

      // Create application with custom content
      const customApp = await createTestApplication(tx, {
        gigId: customGig.id,
        specialistId: customUser.id,
        approach: 'Мой уникальный подход к решению задачи',
        questions: 'Мои специфические вопросы по проекту',
        estimatedEffort: '5 дней'
      })
      expect(customApp.approach).toBe('Мой уникальный подход к решению задачи')
      expect(customApp.questions).toBe('Мои специфические вопросы по проекту')
      expect(customApp.estimatedEffort).toBe('5 дней')
    })
  })
})
