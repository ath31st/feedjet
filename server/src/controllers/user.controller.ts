// src/controllers/user.controller.ts
import type { Request, Response } from 'express';
import type { UserService } from '../services/user.service.js';
import Logger from '../utils/logger.js';
import {
  userCreateSchema,
  userParamsSchema,
  userUpdateSchema,
} from '../validations/schemas/users.schemas.js';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getAll = (_req: Request, res: Response) => {
    try {
      const users = this.userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      Logger.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  };

  getById = (req: Request, res: Response) => {
    try {
      const parseResult = userParamsSchema.safeParse(req.params);
      if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      const user = this.userService.getById(parseResult.data.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      Logger.error('Error fetching user by id:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  };

  create = (req: Request, res: Response) => {
    try {
      const parseResult = userCreateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: parseResult.error.message });
      }

      const user = this.userService.create(parseResult.data);
      res.status(201).json(user);
    } catch (error) {
      Logger.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  };

  update = (req: Request, res: Response) => {
    try {
      const idResult = userParamsSchema.safeParse(req.params);
      if (!idResult.success) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      const bodyResult = userUpdateSchema.safeParse(req.body);
      if (!bodyResult.success) {
        return res.status(400).json({ message: bodyResult.error.message });
      }

      const user = this.userService.update(idResult.data.id, bodyResult.data);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      Logger.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  };

  delete = (req: Request, res: Response) => {
    try {
      const idResult = userParamsSchema.safeParse(req.params);
      if (!idResult.success) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      const deletedCount = this.userService.delete(idResult.data.id);
      if (deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      Logger.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  };
}
