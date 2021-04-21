import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const svc = container.resolve(UpdateUserAvatarService);
    const user = await svc.execute({
      user_id,
      avatarFileName: request.file.filename,
    });
    return response.json(classToClass(user));
  }
}
