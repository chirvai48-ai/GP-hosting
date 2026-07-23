import { Router } from "express";
import { getNews, postNews, getNewsById, deleteNews, updateNews } from "../controllers/newsController";
import { validateCreate, validateUpdate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/requireAuth";
import { createNewsSchema, updateNewschema } from "../schemas/news.schema";

export const newsRouter = Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewsStatus:
 *       type: string
 *       enum: [published, closed]
 *       example: published
 *
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@example.com"
 *         role:
 *           type: string
 *           enum: [Admin, Editor, User]
 *           example: Admin
 *
 *     News:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Company announces new partnership"
 *         body:
 *           type: string
 *           example: "Full article body content goes here..."
 *         summary:
 *           type: string
 *           example: "Brief summary of the news article"
 *         status:
 *           $ref: '#/components/schemas/NewsStatus'
 *         published_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         admin_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         admin:
 *           $ref: '#/components/schemas/Admin'
 *
 *     CreateNewsRequest:
 *       type: object
 *       required:
 *         - title
 *         - body
 *         - summary
 *         - status
 *       properties:
 *         title:
 *           type: string
 *           example: "Company announces new partnership"
 *         body:
 *           type: string
 *           example: "Full article body content goes here..."
 *         summary:
 *           type: string
 *           example: "Brief summary of the news article"
 *         status:
 *           $ref: '#/components/schemas/NewsStatus'
 *         admin_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *
 *     UpdateNewsRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated title"
 *         body:
 *           type: string
 *           example: "Updated body content..."
 *         summary:
 *           type: string
 *           example: "Updated summary"
 *         status:
 *           $ref: '#/components/schemas/NewsStatus'
 *         admin_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *
 *     NewsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/News'
 *
 *     NewsListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "News fetched successfully"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/News'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "An error occurred"
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Retrieve all news articles
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of all news articles ordered by published date descending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsListResponse'
 *             example:
 *               message: "News fetched successfully"
 *               data:
 *                 - id: 1
 *                   title: "Company announces new partnership"
 *                   body: "Full article body..."
 *                   summary: "Brief summary"
 *                   status: "published"
 *                   published_at: "2024-01-15T10:30:00.000Z"
 *                   updated_at: "2024-01-15T10:30:00.000Z"
 *                   admin_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   admin:
 *                     id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     name: "John Doe"
 *                     email: "admin@example.com"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
newsRouter.get("/", getNews);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Retrieve a single news article by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The numeric ID of the news article
 *         example: 1
 *     responses:
 *       200:
 *         description: News article fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsResponse'
 *             example:
 *               message: "news with id 1 fetched successfully"
 *               data:
 *                 id: 1
 *                 title: "Company announces new partnership"
 *                 body: "Full article body..."
 *                 summary: "Brief summary"
 *                 status: "published"
 *                 published_at: "2024-01-15T10:30:00.000Z"
 *                 updated_at: "2024-01-15T10:30:00.000Z"
 *                 admin_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *       404:
 *         description: News article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "News not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
newsRouter.get("/:id", getNewsById);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news article
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNewsRequest'
 *           example:
 *             title: "Company announces new partnership"
 *             body: "Full article body content goes here..."
 *             summary: "Brief summary of the news article"
 *             status: "published"
 *             admin_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       201:
 *         description: News article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsResponse'
 *             example:
 *               message: "news created successfully"
 *               data:
 *                 id: 1
 *                 title: "Company announces new partnership"
 *                 body: "Full article body content goes here..."
 *                 summary: "Brief summary of the news article"
 *                 status: "published"
 *                 published_at: "2024-01-15T10:30:00.000Z"
 *                 updated_at: "2024-01-15T10:30:00.000Z"
 *                 admin_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *       400:
 *         description: Validation error — missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Validation failed"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
newsRouter.post("/", requireAuth, validateCreate(createNewsSchema), postNews);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news article by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The numeric ID of the news article to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: News article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsResponse'
 *             example:
 *               message: "news with id 1 deleted successfully"
 *               data:
 *                 id: 1
 *                 title: "Company announces new partnership"
 *                 body: "Full article body..."
 *                 summary: "Brief summary"
 *                 status: "published"
 *                 published_at: "2024-01-15T10:30:00.000Z"
 *                 updated_at: "2024-01-15T10:30:00.000Z"
 *       404:
 *         description: News article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "News not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
newsRouter.delete("/:id", requireAuth, deleteNews);

/**
 * @swagger
 * /news/{id}:
 *   patch:
 *     summary: Partially update a news article by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The numeric ID of the news article to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNewsRequest'
 *           example:
 *             title: "Updated article title"
 *             status: "closed"
 *     responses:
 *       200:
 *         description: News article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsResponse'
 *             example:
 *               message: "news updated successfully"
 *               data:
 *                 id: 1
 *                 title: "Updated article title"
 *                 body: "Full article body..."
 *                 summary: "Brief summary"
 *                 status: "closed"
 *                 published_at: "2024-01-15T10:30:00.000Z"
 *                 updated_at: "2024-01-16T08:00:00.000Z"
 *                 admin_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *       400:
 *         description: Validation error — invalid fields in request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Validation failed"
 *       404:
 *         description: News article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "News not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
newsRouter.patch("/:id", requireAuth, validateUpdate(updateNewschema), updateNews);

export default newsRouter;