
export enum Product {
    PRO = "Pro",
    STANDARD = "Standard",
    BASIC = "Basic",
    NONE = "none",
}

export interface Quota {
    projects: number;
    finalRenders: number;
}

export type ActionType = "project" | "finalRender";

class ProductQuotas {
    static getQuotas(product: Product): Quota {
        switch (product) {
            case Product.PRO: {
                return {
                    projects: 100,
                    finalRenders: 100
                }
            }
            case Product.STANDARD: {
                return {
                    projects: 15,
                    finalRenders: 15
                }
            }
            case Product.BASIC: {
                return {
                    projects: 5,
                    finalRenders: 5
                }
            }
            case Product.NONE: {
                return {
                    projects: 0,
                    finalRenders: 0
                }
            }
        }
    }
}

export default ProductQuotas;