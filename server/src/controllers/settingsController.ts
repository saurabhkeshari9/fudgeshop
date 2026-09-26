import { Request, Response, NextFunction } from 'express';
import { StoreSettings } from '../models/StoreSettings';

export const getStoreSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateStoreSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
