// import { BadRequestException, Injectable } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
// import { Connection, Repository } from 'typeorm';
// import { UserBossaboxDto } from '../../auth/dto/user-bossabox.dto';
// import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
// import { UnexpectedException } from '../../exceptions/unexpected.exception';
// import { BossaboxApiService } from '../../integrations/bossabox-api.service';
// import { ContestChallengesService } from '../contest-challenges/contest-challenges.service';
// import {
//   ContestChallenges,
//   DeliverablesStages,
//   ProfessionalsType,
//   Users,
//   Vacancies,
// } from '../entities';
// import { SquadToUser } from '../entities/squad-to-user.entity';
// import { Squad } from '../entities/squad.entity';
// import { UserRepository } from '../users/users.repository';
// import { CreateSquadDto } from './dto/create-squad.dto';
// import { JoinSquadDto } from './dto/join-squad.dto';
// import {
//   SquadDeliverablesAttachmentDto,
//   SquadDeliverablesDto,
// } from './dto/squad-deliverables.dto';
// import { UpdateSquadDto } from './dto/update-squad.dto';
// import { SquadDeliverablesAggregate } from './squad-deliverables.aggregate';
// import { SquadFactory } from './squad.factory';

// @Injectable()
// export class SquadService {
//   constructor(
//     @InjectRepository(Squad)
//     private readonly squadRepository: Repository<Squad>,
//     @InjectRepository(SquadToUser)
//     private readonly squadToUserRepository: Repository<SquadToUser>,
//     @InjectRepository(ProfessionalsType)
//     private readonly professionalsTypeRepository: Repository<ProfessionalsType>,
//     @InjectRepository(Users)
//     private readonly userRepository: UserRepository,
//     @InjectRepository(DeliverablesStages)
//     private readonly deliverablesStagesRepository: Repository<DeliverablesStages>,
//     @InjectConnection()
//     private connection: Connection,
//     private contestChallengeService: ContestChallengesService,
//     private squadFactory: SquadFactory,
//     private eventEmitter: EventEmitter2,
//     private readonly bossaboxApiService: BossaboxApiService,
//     private readonly squadDeliverablesAggregate: SquadDeliverablesAggregate,
//   ) {}

//   async createNewSquad(
//     contestChallengeId: number,
//     user: UserBossaboxDto,
//     newSquadDto: CreateSquadDto,
//   ) {
//     const contestChallenge = await this.contestChallengeService.findOne(
//       contestChallengeId,
//     );

//     if (contestChallenge.status !== 'squad_formation')
//       throw new BadRequestException(
//         'Este desafio não está disponível para formações de squads',
//       );
//     const professionalType = await this.isThereProfessionalTypeInChallenge(
//       newSquadDto.professionalTypeId,
//       contestChallenge,
//     );

//     const creator = await this.findOrSaveUser(user, newSquadDto);

//     await this.isUserAlreadyInSquad(creator, contestChallengeId);

//     const queryRunner = this.connection.createQueryRunner();
//     await queryRunner.connect();

//     try {
//       await queryRunner.startTransaction();
//       const result = await queryRunner.manager.save(
//         this.squadFactory.setNewSquad(newSquadDto, contestChallenge, creator),
//       );
//       const squadToUser = this.squadFactory.setNewSquadToUser(
//         creator,
//         professionalType,
//         result,
//       );
//       await queryRunner.manager.save(squadToUser);
//       const vacancies = this.squadFactory.setNewVacancies(
//         contestChallenge.contestChallengesProfessionalsType,
//         newSquadDto.professionalTypeId,
//         result,
//       );
//       await queryRunner.manager.save(vacancies);
//       await queryRunner.commitTransaction();
//       this.eventEmitter.emit('contact.update', {
//         challengeName: contestChallenge.id,
//         squadName: result.id,
//         professionalType: professionalType.name,
//         isCreator: true,
//         token: user.token,
//       });
//       return result;
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       throw new UnexpectedException(
//         `unexpected-error-create-new-squad`,
//         `SquadService.createNewSquad`,
//         error,
//       );
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async findOne(id: string | number) {
//     let squad: Squad;
//     try {
//       squad = await this.squadRepository
//         .createQueryBuilder('squad')
//         .leftJoinAndSelect('squad.vacancies', 'vacancies')
//         .leftJoinAndSelect('vacancies.professionalType', 'professionalType')
//         .leftJoinAndSelect('squad.squadToUser', 'squadToUser')
//         .leftJoinAndSelect('squadToUser.user', 'user')
//         .leftJoinAndSelect('squad.creator', 'creator')
//         .leftJoinAndSelect('squadToUser.professionalType', 'professionalType2')
//         .leftJoinAndSelect(
//           'squad.challengeResults',
//           'challengeResults',
//           `challengeResults.position IN (1,2,3)`,
//         )
//         .where(`squad.id = :squadId`, { squadId: id })
//         .getOne();
//     } catch (err) {
//       throw new UnexpectedException(
//         'unexpeced-error-find-one-squad',
//         'squad.service.findOne',
//         err,
//       );
//     }
//     if (!squad) {
//       throw new EntityNotFoundException('squad-not-found', 'Squad', id);
//     }
//     return squad;
//   }

//   async joinTheSquad(body: JoinSquadDto, user: UserBossaboxDto) {
//     const member = await this.findOrSaveUser(user, body);

//     const squad = await this.findOne(body.squadId);
//     await this.isUserAlreadyInSquad(member, squad.contestChallengeId);
//     await this.checkChallengesOpenFormation(squad.contestChallengeId);

//     const professionalType = await this.findProfessionalType(
//       body.professionalTypeId,
//     );

//     this.checkHaveVacancy(squad.vacancies, body.professionalTypeId);

//     const queryRunner = this.connection.createQueryRunner();
//     await queryRunner.connect();

//     try {
//       await queryRunner.startTransaction();

//       this.checkHaveVacancy(squad.vacancies, body.professionalTypeId);

//       const squadToUser = this.squadFactory.setNewSquadToUser(
//         member,
//         professionalType,
//         squad,
//       );
//       await queryRunner.manager.save(squadToUser);
//       await queryRunner.manager.decrement(
//         Vacancies,
//         {
//           professionalType: professionalType,
//           squad: squad,
//         },
//         'amount',
//         1,
//       );
//       await queryRunner.commitTransaction();
//       this.eventEmitter.emit('contact.update', {
//         challengeName: squad.contestChallengeId,
//         squadName: squad.id,
//         professionalType: professionalType.name,
//         isCreator: false,
//         token: user.token,
//       });
//       await this.sendNewUserInSquadNotification(squad, member);
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       throw new UnexpectedException(
//         `unexpected-error-join-the-squad`,
//         `SquadService.joinTheSquad`,
//         error,
//       );
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async findAll(id: number, userBossabox: UserBossaboxDto) {
//     let squads: Squad[];
//     try {
//       squads = await this.squadRepository
//         .createQueryBuilder('squad')
//         .where({ contestChallengeId: id })
//         .select([
//           'squad.id',
//           'squad.number',
//           'squad.name',
//           'squad.description',
//           'vacancies.amount',
//           'professionalType.name',
//           'professionalType.icon',
//           'professionalType.id',
//           'squadToUser.squadToUser',
//           'squadToUser.userId',
//           'squadToUser.squadId',
//           'user.id',
//           'user.slug',
//           'user.name',
//           'user.avatar',
//           'creator.id',
//         ])
//         .leftJoin('squad.vacancies', 'vacancies')
//         .leftJoin('vacancies.professionalType', 'professionalType')
//         .leftJoin('squad.squadToUser', 'squadToUser')
//         .leftJoin('squadToUser.user', 'user')
//         .leftJoin('squad.creator', 'creator')
//         .getMany();

//       const user = await this.findUser(userBossabox);
//       squads = squads.map((squad) => {
//         squad.isUserSquad = this.checkUserBelongsToSquad(squad, user);
//         squad.userIsCreator = this.checkUserIsSquadCreator(squad, user);
//         return squad;
//       });
//       return squads;
//     } catch (err) {
//       throw new UnexpectedException(
//         'unexpeced-error-find-all-squad',
//         'squad.service.findAll',
//         err,
//       );
//     }
//   }

//   async leaveTheSquad(squadId: number, userBossabox: UserBossaboxDto) {
//     const queryRunner = this.connection.createQueryRunner();
//     await queryRunner.connect();

//     try {
//       await queryRunner.startTransaction();

//       const squad = await this.findOne(squadId);
//       if (!squad)
//         throw new EntityNotFoundException(
//           'squad-not-found-user-leave-the-squad',
//           'Squad',
//           squadId,
//         );

//       const contestChallenge = await this.contestChallengeService.findOne(
//         squad.contestChallengeId,
//       );

//       if (
//         contestChallenge.status === 'squad_formation' ||
//         contestChallenge.status === 'in_progress'
//       ) {
//         const user = await this.userRepository.findOne({
//           bbox_id: userBossabox._id,
//         });
//         if (!user)
//           throw new EntityNotFoundException(
//             'user-not-found-leave-the-squad',
//             'User',
//             userBossabox._id,
//           );

//         const usersOfSquad = await queryRunner.manager.find(SquadToUser, {
//           where: { squad },
//           relations: ['user', 'professionalType'],
//         });

//         const selectedMember = usersOfSquad.filter(
//           (member) => member.user.id === user.id,
//         )[0];

//         if (!selectedMember)
//           throw new BadRequestException(
//             'Este usuário não participa desta squad.',
//           );

//         const professionalType = selectedMember.professionalType;
//         await queryRunner.manager.delete(
//           SquadToUser,
//           selectedMember.squadToUser,
//         );

//         if (usersOfSquad.length <= 1) {
//           await queryRunner.manager.delete(Vacancies, squad.vacancies);
//           await queryRunner.manager.delete(Squad, squad.id);
//         }

//         if (
//           contestChallenge.status === 'squad_formation' &&
//           usersOfSquad.length > 1
//         ) {
//           await queryRunner.manager.increment(
//             Vacancies,
//             {
//               professionalType: professionalType,
//               squad: squad,
//             },
//             'amount',
//             1,
//           );
//         }
//         await queryRunner.commitTransaction();
//       } else {
//         throw new BadRequestException(
//           'Não é possivel sair de uma squad na atual etapa do desafio.',
//         );
//       }
//     } catch (err) {
//       await queryRunner.rollbackTransaction();
//       throw new UnexpectedException(
//         'unexpeced-error-leave-the-squad',
//         'squad.service.leave.the.squad',
//         err,
//       );
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async update(id: number, updateSquadData: UpdateSquadDto) {
//     const queryRunner = this.connection.createQueryRunner();
//     await queryRunner.connect();

//     try {
//       await queryRunner.startTransaction();

//       const squadToUpdate = await this.findOne(id);
//       if (!squadToUpdate)
//         throw new EntityNotFoundException(
//           'squad-not-found-update-squad',
//           'Squad',
//           squadToUpdate.id,
//         );

//       const contestChallenge = await this.contestChallengeService.findOne(
//         squadToUpdate.contestChallengeId,
//       );

//       if (
//         contestChallenge.status === 'squad_formation' ||
//         contestChallenge.status === 'in_progress'
//       ) {
//         await queryRunner.manager.update(Squad, squadToUpdate.id, {
//           name: updateSquadData.name
//             ? updateSquadData.name
//             : squadToUpdate.name,
//           description: updateSquadData.description
//             ? updateSquadData.description
//             : squadToUpdate.description,
//         });
//         await queryRunner.commitTransaction();
//       } else {
//         throw new BadRequestException(
//           'Não é possivel alterar uma squad na atual etapa do desafio.',
//         );
//       }
//     } catch (err) {
//       await queryRunner.rollbackTransaction();
//       throw new UnexpectedException(
//         'unexpeced-error-update-squad',
//         'squad.service.update',
//         err,
//       );
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   private async isThereProfessionalTypeInChallenge(
//     id: number,
//     contestChallenge: ContestChallenges,
//   ) {
//     const professionalsTypeList =
//       contestChallenge.contestChallengesProfessionalsType
//         .filter(
//           (challengeProfessionalType) =>
//             challengeProfessionalType.professionalsType.id === id,
//         )
//         .map(
//           (challengeProfessionalType) =>
//             challengeProfessionalType.professionalsType,
//         );

//     if (professionalsTypeList && professionalsTypeList.length === 0) {
//       throw new BadRequestException(
//         `Por favor, escolha outra área de atuação, pois a escolhida não é necessária para este desafio`,
//       );
//     }
//     const [professionalType] = professionalsTypeList;
//     return professionalType;
//   }

//   private async findProfessionalType(id: number) {
//     let professionalsType: ProfessionalsType;
//     try {
//       professionalsType = await this.professionalsTypeRepository.findOne(id);
//     } catch (error) {
//       throw new UnexpectedException(
//         `find-professional-type-by-id`,
//         `SquadService.createNewSquad`,
//         error,
//       );
//     }
//     if (!professionalsType) {
//       throw new EntityNotFoundException(
//         `find-professional-type-by-id`,
//         `ProfessionalType`,
//         id,
//       );
//     }
//     return professionalsType;
//   }

//   async uploadFile(
//     squadId: string,
//     deliverables: SquadDeliverablesDto,
//     file: Express.Multer.File,
//   ): Promise<SquadDeliverablesAttachmentDto> {
//     if (!squadId) {
//       throw new BadRequestException('O id da squad é obrigatório');
//     }
//     if (!file) {
//       throw new BadRequestException(
//         'Os entregáveis precisam pelo menos de um arquivo em anexo',
//       );
//     }
//     if (!deliverables || !deliverables.stageId) {
//       throw new BadRequestException('Os entregáveis da squad são obrigatórios');
//     }

//     if (!deliverables.attachments || deliverables.attachments.length === 0) {
//       throw new BadRequestException(
//         'Os entregáveis precisam pelo menos de um anexo (link ou arquivo)',
//       );
//     }

//     try {
//       const squad = await this.squadRepository.findOneOrFail(squadId);

//       const selectedDeliverableStage =
//         await this.deliverablesStagesRepository.findOne(deliverables.stageId);
//       if (!selectedDeliverableStage) {
//         throw new BadRequestException(
//           'A etapa enviada não corresponde a nenhuma etapa válida',
//         );
//       }

//       const path = this.squadDeliverablesAggregate.getBucketToAttachments(
//         squad.id,
//         selectedDeliverableStage.name,
//       );
//       const [attachment] = deliverables.attachments;
//       return this.squadDeliverablesAggregate.uploadFile(
//         file,
//         attachment.name,
//         path,
//       );
//     } catch (error) {
//       throw new UnexpectedException(
//         'upload-deliverables-files-squad',
//         'SquadService.uploadFile',
//         error,
//       );
//     }
//   }

//   async removeDeliverables(squadId: string, stageId: number) {
//     if (!squadId) {
//       throw new BadRequestException('O id da squad é obrigatório');
//     }
//     if (!stageId) {
//       throw new BadRequestException('O id da etapa é obrigatório');
//     }
//     try {
//       const squad = await this.squadRepository.findOneOrFail(squadId);
//       const selectedDeliverableStage =
//         await this.deliverablesStagesRepository.findOneOrFail(stageId);
//       return this.squadDeliverablesAggregate.removeDeliverables(
//         squad,
//         selectedDeliverableStage,
//       );
//     } catch (error) {
//       throw new UnexpectedException(
//         'remove-squad-deliverables-attachments',
//         'SquadService.removeDeliverables',
//         error,
//       );
//     }
//   }

//   async sendDeliverables(
//     squadId: string,
//     userBossabox: UserBossaboxDto,
//     deliverables: SquadDeliverablesDto,
//   ) {
//     if (!squadId) {
//       throw new BadRequestException('O id da squad é obrigatório');
//     }
//     if (!userBossabox || !userBossabox._id) {
//       throw new BadRequestException('O id do criador é obrigatório');
//     }
//     if (!deliverables || !deliverables.stageId) {
//       throw new BadRequestException('Os entregáveis da squad são obrigatórios');
//     }

//     if (!deliverables.attachments || deliverables.attachments.length === 0) {
//       throw new BadRequestException(
//         'Os entregáveis precisam pelo menos de um anexo (link ou arquivo)',
//       );
//     }
//     try {
//       const creator = await this.userRepository.findOneOrFail({
//         bbox_id: userBossabox._id,
//       });
//       const squad = await this.squadRepository.findOneOrFail(squadId);
//       return this.squadDeliverablesAggregate.save(squad, creator, deliverables);
//     } catch (error) {
//       throw new UnexpectedException(
//         'send-squad-deliverables-attachments',
//         'SquadService.sendDeliverables',
//         error,
//       );
//     }
//   }

//   private async findUser(userBossabox: UserBossaboxDto) {
//     return await this.userRepository.findOne({
//       bbox_id: userBossabox._id,
//     });
//   }

//   private async findOrSaveUser(
//     userBossabox: UserBossaboxDto,
//     squadDto: CreateSquadDto | JoinSquadDto,
//   ) {
//     let creator: Users;
//     try {
//       creator = await this.userRepository.findOne({
//         bbox_id: userBossabox._id,
//       });
//       if (!creator) {
//         const newUser = {
//           bbox_id: userBossabox._id,
//           email: userBossabox.email,
//           name: userBossabox.fullName,
//           slug: squadDto.slug,
//           avatar: squadDto.avatar,
//           notified: true,
//         };
//         return await this.userRepository.save(newUser);
//       } else if (!creator.slug || !creator.avatar) {
//         creator.slug = squadDto.slug;
//         creator.avatar = squadDto.avatar;
//         return await this.userRepository.save(creator);
//       }
//     } catch (error) {
//       throw new UnexpectedException(
//         `unexpected-error-save-creator`,
//         `SquadService.createNewSquad`,
//         error,
//       );
//     }
//     return creator;
//   }

//   private async isUserAlreadyInSquad(
//     member: Users,
//     contestChallengeId: number,
//   ) {
//     let userAlreadyHasASquad;
//     try {
//       userAlreadyHasASquad = await this.squadToUserRepository
//         .createQueryBuilder('squadToUser')
//         .innerJoinAndSelect(
//           'squadToUser.squad',
//           'squad',
//           `squad.contestChallengeId = :contestChallengeId`,
//           {
//             contestChallengeId,
//           },
//         )
//         .where(`squadToUser.userId = :userId`, {
//           userId: member.id,
//         })
//         .getOne();
//     } catch (error) {
//       throw new UnexpectedException(
//         `verify-member-already-participate-in-squad`,
//         `SquadService.createNewSquad`,
//         error,
//       );
//     }
//     if (userAlreadyHasASquad) {
//       throw new BadRequestException('O usuário já participa de uma squad');
//     }
//   }

//   private checkHaveVacancy(
//     vacancies: Vacancies[],
//     selectedProfessionalTypeId: number,
//   ) {
//     const selectedVacancy = vacancies.find(
//       (vacancy) => vacancy.professionalType.id === selectedProfessionalTypeId,
//     );

//     if (!selectedVacancy || selectedVacancy.amount < 1)
//       throw new BadRequestException('Essa vaga já foi preenchida');

//     return true;
//   }

//   private checkUserBelongsToSquad(squad: Squad, user: Users): boolean {
//     return !!squad.squadToUser.find(
//       (squadUser) => user && squadUser.user.id === user.id,
//     );
//   }

//   private checkUserIsSquadCreator(squad: Squad, user: Users): boolean {
//     return user && squad.creator.id === user.id;
//   }

//   private async sendNewUserInSquadNotification(squad: Squad, user: Users) {
//     const userIds = squad.squadToUser
//       .map((squadUser) => squadUser.user.bbox_id)
//       .filter((userId) => userId !== user.bbox_id);
//     if (!userIds) return;
//     const notification = {
//       title: 'Oba, mais uma pessoa no squad!🎉',
//       text: 'Alguém entrou no seu squad do BossaBox Labs, clique aqui para ver quem foi.',
//       iconType: 'challenge',
//       url: '/bossabox-labs/squads',
//     };
//     await this.bossaboxApiService.sendNotification(notification, userIds);
//   }

//   private async checkChallengesOpenFormation(id) {
//     const contestChallenge = await this.contestChallengeService.findOne(id);

//     if (contestChallenge.status === 'squad_formation') {
//       return true;
//     } else {
//       throw new BadRequestException(
//         'Este desafio não está disponível para formações de squads',
//       );
//     }
//   }
// }
