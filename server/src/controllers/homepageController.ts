import { Request, Response, NextFunction } from 'express';
import { HomepageContent } from '../models/HomepageContent';

export const getHomepageContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let content = await HomepageContent.findOne();
    if (!content) {
      content = await HomepageContent.create({});
    }
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const updateHomepageContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let content = await HomepageContent.findOne();
    if (!content) {
      content = await HomepageContent.create(req.body);
    } else {
      Object.assign(content, req.body);
      await content.save();
    }

    res.status(200).json({
      success: true,
      message: 'Homepage content updated successfully',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};
