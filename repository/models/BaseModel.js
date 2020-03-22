import { BaseModel as OrmBaseModel, types } from 'expo-sqlite-orm'

export const relationTypes = {
  MANY: 'MANY',
  ONE: 'ONE',
};

export class BaseModel extends OrmBaseModel {
  constructor(obj) {
    super(obj)
  }

  /**
   * Список связей
   *
   * @returns {{string: [string, BaseModel, string, string]}}
   */
  static get relations() {
    return {};
  }

  /**
   * Подгружает связи к моделям
   * @param {BaseModel[]} models
   * @param {string[]} relations
   */
  static async loadRelations(models, relations) {
    if (models.length === 0) {
      return
    }

    relations = relations.filter(v => !!v).filter(onlyUnique);
    if (relations.length === 0) {
      return
    }
    // console.log('loadRelations', models, relations);
    const rMap = {};
    relations.forEach(relation => {
      let relationChain = relation.split('.');
      const firstR = relationChain.shift();
      if (!rMap[firstR]) {
        rMap[firstR] = [];
      }
      rMap[firstR].push(relationChain.join('.'));
    });
    // console.log('loadRelations rMap', rMap);

    await Promise.all(Object.entries(rMap).map(([r, chain]) => new Promise(async (resolve, _) => {
      // console.log('loadRelations relations chain', r, chain);
      // console.log('loadRelations relation params', r, this.relations);
      if (!this.relations[r]) {
        throw new Error(`relation "${r}" not declare in model`)
      }
      const [rType, rClass, rCol, rForeignCol] = this.relations[r];
      if (!relationTypes[rType]) {
        throw new Error(`unsupported relation type "${rType}"`)
      }
      const ids = models.map(model => model[rCol]).filter(v => !!v).filter(onlyUnique);
      const map = {};
      if (ids.length > 0) {
        const rModels = await rClass.query({where: {[`${rForeignCol}_in`]: ids}});
        // console.log('loadRelations rClass.query', rModels);
        if (rModels.length > 0) {
          await rClass.loadRelations(rModels, chain);
        }
        // console.log('loadRelations rClass.loadRelations', rModels);
        rModels.forEach(rModel => {
          if (!map[rModel[rForeignCol]]) {
            map[rModel[rForeignCol]] = [];
          }
          map[rModel[rForeignCol]].push(rModel);
        });
      }
      models.forEach(model => {
        switch (rType) {
          case relationTypes.ONE:
            model[r] = map[model[rCol]][0] || null;
            break;
          case relationTypes.MANY:
            if (!model[r]) {
              model[r] = [];
            }
            if (map[model[rCol]]) {
              model[r].push(...map[model[rCol]]);
            }
            break;
        }
      });
      resolve();
    })));
  }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export default BaseModel
