import { PickByType, HasType } from "./types";
import type { Visitor } from "handlebars";
export type VisitorF = Omit<PickByType<Visitor, (v?: HasType) => void>, 'acceptArray'>;
export const makeGuard = <K extends keyof VisitorF & string>(type: K) =>
  function isGuard(v?: unknown): v is Parameters<VisitorF[K]>[0] {
    return isObjectLike(v) && 'type' in v && v?.type === type;
  };
export function isObjectLike(v: unknown): v is Record<PropertyKey, unknown> {
  if (v == null) return false;
  switch (typeof v) {
    case 'object':
    case 'function':
      return true;
  }
  return false;
}
export const isPathExpression = makeGuard('PathExpression');
export const isBlockStatement = makeGuard('BlockStatement');
export const isMustachStatement = makeGuard('MustacheStatement');
export const isProgram = makeGuard('Program');