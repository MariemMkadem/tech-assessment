class EligibilityService {
  /**
   * Vérifie si le panier est éligible en fonction des critères.
   * @param {Object} cart - L'objet panier.
   * @param {Object} criteria - Les critères d'éligibilité.
   * @returns {boolean} - True si éligible, sinon false.
   */
  isEligible(cart, criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      return true;
    }

    return Object.keys(criteria).every(key => {
      const condition = criteria[key];
      const cartValue = this.getCartValue(cart, key);

      if (Array.isArray(cartValue)) {
        return cartValue.some(value => this.matchCondition(value, condition));
      }

      return this.matchCondition(cartValue, condition);
    });
  }

  /**
   * Récupère la valeur d'une clé imbriquée dans le panier.
   * @param {Object} cart - L'objet panier.
   * @param {string} key - La clé imbriquée sous forme de chaîne.
   * @returns {*} - La valeur correspondant à la clé.
   */
  getCartValue(cart, key) {
    return key.split('.').reduce((obj, part) => {
      if (!obj) return undefined;

      if (Array.isArray(obj)) {
        return obj.flatMap(subObj => subObj[part] !== undefined ? subObj[part] : []);
      }

      return obj[part];
    }, cart);
  }

    /**
   * Vérifie si une valeur satisfait une condition.
   * @param {*} value - La valeur à tester.
   * @param {*} condition - La condition à vérifier.
   * @returns {boolean} - True si la condition est remplie, sinon false.
   */
    matchCondition(value, condition) {
      if (typeof condition === 'object' && condition !== null) {
        const operators = ['gt', 'lt', 'gte', 'lte', 'in', 'and', 'or'];
        for (const operator of operators) {
          if (condition[operator] !== undefined) {
            return this.evaluateCondition(value, operator, condition[operator]);
          }
        }
      }
      return value == condition;
    }
}

module.exports = { EligibilityService };
