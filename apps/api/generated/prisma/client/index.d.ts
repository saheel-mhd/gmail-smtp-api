
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model SmtpAccount
 * 
 */
export type SmtpAccount = $Result.DefaultSelection<Prisma.$SmtpAccountPayload>
/**
 * Model ApiKey
 * 
 */
export type ApiKey = $Result.DefaultSelection<Prisma.$ApiKeyPayload>
/**
 * Model ApiKeyPermission
 * 
 */
export type ApiKeyPermission = $Result.DefaultSelection<Prisma.$ApiKeyPermissionPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model Template
 * 
 */
export type Template = $Result.DefaultSelection<Prisma.$TemplatePayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TenantStatus: {
  active: 'active',
  disabled: 'disabled'
};

export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus]


export const UserRole: {
  owner: 'owner',
  admin: 'admin',
  readonly: 'readonly'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const SenderStatus: {
  active: 'active',
  disabled: 'disabled',
  needs_attention: 'needs_attention'
};

export type SenderStatus = (typeof SenderStatus)[keyof typeof SenderStatus]


export const ApiKeyStatus: {
  active: 'active',
  revoked: 'revoked'
};

export type ApiKeyStatus = (typeof ApiKeyStatus)[keyof typeof ApiKeyStatus]


export const TemplateStatus: {
  active: 'active',
  disabled: 'disabled'
};

export type TemplateStatus = (typeof TemplateStatus)[keyof typeof TemplateStatus]


export const MessageStatus: {
  queued: 'queued',
  sending: 'sending',
  sent: 'sent',
  failed: 'failed'
};

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus]


export const ActorType: {
  user: 'user',
  api_key: 'api_key',
  system: 'system'
};

export type ActorType = (typeof ActorType)[keyof typeof ActorType]

}

export type TenantStatus = $Enums.TenantStatus

export const TenantStatus: typeof $Enums.TenantStatus

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type SenderStatus = $Enums.SenderStatus

export const SenderStatus: typeof $Enums.SenderStatus

export type ApiKeyStatus = $Enums.ApiKeyStatus

export const ApiKeyStatus: typeof $Enums.ApiKeyStatus

export type TemplateStatus = $Enums.TemplateStatus

export const TemplateStatus: typeof $Enums.TemplateStatus

export type MessageStatus = $Enums.MessageStatus

export const MessageStatus: typeof $Enums.MessageStatus

export type ActorType = $Enums.ActorType

export const ActorType: typeof $Enums.ActorType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.smtpAccount`: Exposes CRUD operations for the **SmtpAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SmtpAccounts
    * const smtpAccounts = await prisma.smtpAccount.findMany()
    * ```
    */
  get smtpAccount(): Prisma.SmtpAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiKey`: Exposes CRUD operations for the **ApiKey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiKeys
    * const apiKeys = await prisma.apiKey.findMany()
    * ```
    */
  get apiKey(): Prisma.ApiKeyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiKeyPermission`: Exposes CRUD operations for the **ApiKeyPermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiKeyPermissions
    * const apiKeyPermissions = await prisma.apiKeyPermission.findMany()
    * ```
    */
  get apiKeyPermission(): Prisma.ApiKeyPermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.template`: Exposes CRUD operations for the **Template** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Templates
    * const templates = await prisma.template.findMany()
    * ```
    */
  get template(): Prisma.TemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    User: 'User',
    SmtpAccount: 'SmtpAccount',
    ApiKey: 'ApiKey',
    ApiKeyPermission: 'ApiKeyPermission',
    Message: 'Message',
    Template: 'Template',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tenant" | "user" | "smtpAccount" | "apiKey" | "apiKeyPermission" | "message" | "template" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      SmtpAccount: {
        payload: Prisma.$SmtpAccountPayload<ExtArgs>
        fields: Prisma.SmtpAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SmtpAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SmtpAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>
          }
          findFirst: {
            args: Prisma.SmtpAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SmtpAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>
          }
          findMany: {
            args: Prisma.SmtpAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>[]
          }
          create: {
            args: Prisma.SmtpAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>
          }
          createMany: {
            args: Prisma.SmtpAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SmtpAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>[]
          }
          delete: {
            args: Prisma.SmtpAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>
          }
          update: {
            args: Prisma.SmtpAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>
          }
          deleteMany: {
            args: Prisma.SmtpAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SmtpAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SmtpAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>[]
          }
          upsert: {
            args: Prisma.SmtpAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpAccountPayload>
          }
          aggregate: {
            args: Prisma.SmtpAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSmtpAccount>
          }
          groupBy: {
            args: Prisma.SmtpAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<SmtpAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.SmtpAccountCountArgs<ExtArgs>
            result: $Utils.Optional<SmtpAccountCountAggregateOutputType> | number
          }
        }
      }
      ApiKey: {
        payload: Prisma.$ApiKeyPayload<ExtArgs>
        fields: Prisma.ApiKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findFirst: {
            args: Prisma.ApiKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findMany: {
            args: Prisma.ApiKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          create: {
            args: Prisma.ApiKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          createMany: {
            args: Prisma.ApiKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiKeyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          delete: {
            args: Prisma.ApiKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          update: {
            args: Prisma.ApiKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          deleteMany: {
            args: Prisma.ApiKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiKeyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          upsert: {
            args: Prisma.ApiKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          aggregate: {
            args: Prisma.ApiKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiKey>
          }
          groupBy: {
            args: Prisma.ApiKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiKeyCountArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyCountAggregateOutputType> | number
          }
        }
      }
      ApiKeyPermission: {
        payload: Prisma.$ApiKeyPermissionPayload<ExtArgs>
        fields: Prisma.ApiKeyPermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiKeyPermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiKeyPermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>
          }
          findFirst: {
            args: Prisma.ApiKeyPermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiKeyPermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>
          }
          findMany: {
            args: Prisma.ApiKeyPermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>[]
          }
          create: {
            args: Prisma.ApiKeyPermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>
          }
          createMany: {
            args: Prisma.ApiKeyPermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiKeyPermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>[]
          }
          delete: {
            args: Prisma.ApiKeyPermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>
          }
          update: {
            args: Prisma.ApiKeyPermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>
          }
          deleteMany: {
            args: Prisma.ApiKeyPermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiKeyPermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiKeyPermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>[]
          }
          upsert: {
            args: Prisma.ApiKeyPermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPermissionPayload>
          }
          aggregate: {
            args: Prisma.ApiKeyPermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiKeyPermission>
          }
          groupBy: {
            args: Prisma.ApiKeyPermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyPermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiKeyPermissionCountArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyPermissionCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      Template: {
        payload: Prisma.$TemplatePayload<ExtArgs>
        fields: Prisma.TemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findFirst: {
            args: Prisma.TemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findMany: {
            args: Prisma.TemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          create: {
            args: Prisma.TemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          createMany: {
            args: Prisma.TemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          delete: {
            args: Prisma.TemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          update: {
            args: Prisma.TemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          deleteMany: {
            args: Prisma.TemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          upsert: {
            args: Prisma.TemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          aggregate: {
            args: Prisma.TemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemplate>
          }
          groupBy: {
            args: Prisma.TemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TemplateCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    tenant?: TenantOmit
    user?: UserOmit
    smtpAccount?: SmtpAccountOmit
    apiKey?: ApiKeyOmit
    apiKeyPermission?: ApiKeyPermissionOmit
    message?: MessageOmit
    template?: TemplateOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    users: number
    smtpAccounts: number
    apiKeys: number
    templates: number
    messages: number
    auditLogs: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs
    smtpAccounts?: boolean | TenantCountOutputTypeCountSmtpAccountsArgs
    apiKeys?: boolean | TenantCountOutputTypeCountApiKeysArgs
    templates?: boolean | TenantCountOutputTypeCountTemplatesArgs
    messages?: boolean | TenantCountOutputTypeCountMessagesArgs
    auditLogs?: boolean | TenantCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountSmtpAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SmtpAccountWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountApiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountTemplatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type SmtpAccountCountOutputType
   */

  export type SmtpAccountCountOutputType = {
    permissions: number
    messages: number
  }

  export type SmtpAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | SmtpAccountCountOutputTypeCountPermissionsArgs
    messages?: boolean | SmtpAccountCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * SmtpAccountCountOutputType without action
   */
  export type SmtpAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccountCountOutputType
     */
    select?: SmtpAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SmtpAccountCountOutputType without action
   */
  export type SmtpAccountCountOutputTypeCountPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyPermissionWhereInput
  }

  /**
   * SmtpAccountCountOutputType without action
   */
  export type SmtpAccountCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type ApiKeyCountOutputType
   */

  export type ApiKeyCountOutputType = {
    permissions: number
    messages: number
  }

  export type ApiKeyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | ApiKeyCountOutputTypeCountPermissionsArgs
    messages?: boolean | ApiKeyCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ApiKeyCountOutputType without action
   */
  export type ApiKeyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyCountOutputType
     */
    select?: ApiKeyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ApiKeyCountOutputType without action
   */
  export type ApiKeyCountOutputTypeCountPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyPermissionWhereInput
  }

  /**
   * ApiKeyCountOutputType without action
   */
  export type ApiKeyCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    dailySentCount: number | null
  }

  export type TenantSumAggregateOutputType = {
    dailySentCount: number | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    plan: string | null
    status: $Enums.TenantStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    dailySentCount: number | null
    dailyCountResetAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    plan: string | null
    status: $Enums.TenantStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    dailySentCount: number | null
    dailyCountResetAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    plan: number
    status: number
    createdAt: number
    updatedAt: number
    dailySentCount: number
    dailyCountResetAt: number
    _all: number
  }


  export type TenantAvgAggregateInputType = {
    dailySentCount?: true
  }

  export type TenantSumAggregateInputType = {
    dailySentCount?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    plan?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    dailySentCount?: true
    dailyCountResetAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    plan?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    dailySentCount?: true
    dailyCountResetAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    plan?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    dailySentCount?: true
    dailyCountResetAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    name: string
    plan: string
    status: $Enums.TenantStatus
    createdAt: Date
    updatedAt: Date
    dailySentCount: number
    dailyCountResetAt: Date | null
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    plan?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dailySentCount?: boolean
    dailyCountResetAt?: boolean
    users?: boolean | Tenant$usersArgs<ExtArgs>
    smtpAccounts?: boolean | Tenant$smtpAccountsArgs<ExtArgs>
    apiKeys?: boolean | Tenant$apiKeysArgs<ExtArgs>
    templates?: boolean | Tenant$templatesArgs<ExtArgs>
    messages?: boolean | Tenant$messagesArgs<ExtArgs>
    auditLogs?: boolean | Tenant$auditLogsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    plan?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dailySentCount?: boolean
    dailyCountResetAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    plan?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dailySentCount?: boolean
    dailyCountResetAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    plan?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dailySentCount?: boolean
    dailyCountResetAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "plan" | "status" | "createdAt" | "updatedAt" | "dailySentCount" | "dailyCountResetAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Tenant$usersArgs<ExtArgs>
    smtpAccounts?: boolean | Tenant$smtpAccountsArgs<ExtArgs>
    apiKeys?: boolean | Tenant$apiKeysArgs<ExtArgs>
    templates?: boolean | Tenant$templatesArgs<ExtArgs>
    messages?: boolean | Tenant$messagesArgs<ExtArgs>
    auditLogs?: boolean | Tenant$auditLogsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      smtpAccounts: Prisma.$SmtpAccountPayload<ExtArgs>[]
      apiKeys: Prisma.$ApiKeyPayload<ExtArgs>[]
      templates: Prisma.$TemplatePayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      plan: string
      status: $Enums.TenantStatus
      createdAt: Date
      updatedAt: Date
      dailySentCount: number
      dailyCountResetAt: Date | null
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Tenant$usersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    smtpAccounts<T extends Tenant$smtpAccountsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$smtpAccountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    apiKeys<T extends Tenant$apiKeysArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$apiKeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    templates<T extends Tenant$templatesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$templatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends Tenant$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends Tenant$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly plan: FieldRef<"Tenant", 'String'>
    readonly status: FieldRef<"Tenant", 'TenantStatus'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
    readonly dailySentCount: FieldRef<"Tenant", 'Int'>
    readonly dailyCountResetAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.users
   */
  export type Tenant$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Tenant.smtpAccounts
   */
  export type Tenant$smtpAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    where?: SmtpAccountWhereInput
    orderBy?: SmtpAccountOrderByWithRelationInput | SmtpAccountOrderByWithRelationInput[]
    cursor?: SmtpAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SmtpAccountScalarFieldEnum | SmtpAccountScalarFieldEnum[]
  }

  /**
   * Tenant.apiKeys
   */
  export type Tenant$apiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    cursor?: ApiKeyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * Tenant.templates
   */
  export type Tenant$templatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    cursor?: TemplateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Tenant.messages
   */
  export type Tenant$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Tenant.auditLogs
   */
  export type Tenant$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    mfaEnabled: boolean | null
    mfaSecretEnc: string | null
    mfaSecretIv: string | null
    mfaSecretTag: string | null
    lastLogin: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    mfaEnabled: boolean | null
    mfaSecretEnc: string | null
    mfaSecretIv: string | null
    mfaSecretTag: string | null
    lastLogin: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    tenantId: number
    email: number
    passwordHash: number
    role: number
    mfaEnabled: number
    mfaSecretEnc: number
    mfaSecretIv: number
    mfaSecretTag: number
    lastLogin: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    passwordHash?: true
    role?: true
    mfaEnabled?: true
    mfaSecretEnc?: true
    mfaSecretIv?: true
    mfaSecretTag?: true
    lastLogin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    passwordHash?: true
    role?: true
    mfaEnabled?: true
    mfaSecretEnc?: true
    mfaSecretIv?: true
    mfaSecretTag?: true
    lastLogin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    passwordHash?: true
    role?: true
    mfaEnabled?: true
    mfaSecretEnc?: true
    mfaSecretIv?: true
    mfaSecretTag?: true
    lastLogin?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    tenantId: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    mfaEnabled: boolean
    mfaSecretEnc: string | null
    mfaSecretIv: string | null
    mfaSecretTag: string | null
    lastLogin: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    mfaEnabled?: boolean
    mfaSecretEnc?: boolean
    mfaSecretIv?: boolean
    mfaSecretTag?: boolean
    lastLogin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    mfaEnabled?: boolean
    mfaSecretEnc?: boolean
    mfaSecretIv?: boolean
    mfaSecretTag?: boolean
    lastLogin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    mfaEnabled?: boolean
    mfaSecretEnc?: boolean
    mfaSecretIv?: boolean
    mfaSecretTag?: boolean
    lastLogin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    tenantId?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    mfaEnabled?: boolean
    mfaSecretEnc?: boolean
    mfaSecretIv?: boolean
    mfaSecretTag?: boolean
    lastLogin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "email" | "passwordHash" | "role" | "mfaEnabled" | "mfaSecretEnc" | "mfaSecretIv" | "mfaSecretTag" | "lastLogin" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      email: string
      passwordHash: string
      role: $Enums.UserRole
      mfaEnabled: boolean
      mfaSecretEnc: string | null
      mfaSecretIv: string | null
      mfaSecretTag: string | null
      lastLogin: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly tenantId: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly mfaEnabled: FieldRef<"User", 'Boolean'>
    readonly mfaSecretEnc: FieldRef<"User", 'String'>
    readonly mfaSecretIv: FieldRef<"User", 'String'>
    readonly mfaSecretTag: FieldRef<"User", 'String'>
    readonly lastLogin: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model SmtpAccount
   */

  export type AggregateSmtpAccount = {
    _count: SmtpAccountCountAggregateOutputType | null
    _avg: SmtpAccountAvgAggregateOutputType | null
    _sum: SmtpAccountSumAggregateOutputType | null
    _min: SmtpAccountMinAggregateOutputType | null
    _max: SmtpAccountMaxAggregateOutputType | null
  }

  export type SmtpAccountAvgAggregateOutputType = {
    perMinuteLimit: number | null
    perDayLimit: number | null
    sentTodayCount: number | null
    errorStreak: number | null
    healthScore: number | null
  }

  export type SmtpAccountSumAggregateOutputType = {
    perMinuteLimit: number | null
    perDayLimit: number | null
    sentTodayCount: number | null
    errorStreak: number | null
    healthScore: number | null
  }

  export type SmtpAccountMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    label: string | null
    gmailAddress: string | null
    encryptedAppPassword: string | null
    iv: string | null
    authTag: string | null
    keyVersion: string | null
    status: $Enums.SenderStatus | null
    perMinuteLimit: number | null
    perDayLimit: number | null
    sentTodayCount: number | null
    sentTodayResetAt: Date | null
    lastSuccessAt: Date | null
    lastErrorAt: Date | null
    errorStreak: number | null
    healthScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SmtpAccountMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    label: string | null
    gmailAddress: string | null
    encryptedAppPassword: string | null
    iv: string | null
    authTag: string | null
    keyVersion: string | null
    status: $Enums.SenderStatus | null
    perMinuteLimit: number | null
    perDayLimit: number | null
    sentTodayCount: number | null
    sentTodayResetAt: Date | null
    lastSuccessAt: Date | null
    lastErrorAt: Date | null
    errorStreak: number | null
    healthScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SmtpAccountCountAggregateOutputType = {
    id: number
    tenantId: number
    label: number
    gmailAddress: number
    encryptedAppPassword: number
    iv: number
    authTag: number
    keyVersion: number
    status: number
    perMinuteLimit: number
    perDayLimit: number
    sentTodayCount: number
    sentTodayResetAt: number
    lastSuccessAt: number
    lastErrorAt: number
    errorStreak: number
    healthScore: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SmtpAccountAvgAggregateInputType = {
    perMinuteLimit?: true
    perDayLimit?: true
    sentTodayCount?: true
    errorStreak?: true
    healthScore?: true
  }

  export type SmtpAccountSumAggregateInputType = {
    perMinuteLimit?: true
    perDayLimit?: true
    sentTodayCount?: true
    errorStreak?: true
    healthScore?: true
  }

  export type SmtpAccountMinAggregateInputType = {
    id?: true
    tenantId?: true
    label?: true
    gmailAddress?: true
    encryptedAppPassword?: true
    iv?: true
    authTag?: true
    keyVersion?: true
    status?: true
    perMinuteLimit?: true
    perDayLimit?: true
    sentTodayCount?: true
    sentTodayResetAt?: true
    lastSuccessAt?: true
    lastErrorAt?: true
    errorStreak?: true
    healthScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SmtpAccountMaxAggregateInputType = {
    id?: true
    tenantId?: true
    label?: true
    gmailAddress?: true
    encryptedAppPassword?: true
    iv?: true
    authTag?: true
    keyVersion?: true
    status?: true
    perMinuteLimit?: true
    perDayLimit?: true
    sentTodayCount?: true
    sentTodayResetAt?: true
    lastSuccessAt?: true
    lastErrorAt?: true
    errorStreak?: true
    healthScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SmtpAccountCountAggregateInputType = {
    id?: true
    tenantId?: true
    label?: true
    gmailAddress?: true
    encryptedAppPassword?: true
    iv?: true
    authTag?: true
    keyVersion?: true
    status?: true
    perMinuteLimit?: true
    perDayLimit?: true
    sentTodayCount?: true
    sentTodayResetAt?: true
    lastSuccessAt?: true
    lastErrorAt?: true
    errorStreak?: true
    healthScore?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SmtpAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SmtpAccount to aggregate.
     */
    where?: SmtpAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpAccounts to fetch.
     */
    orderBy?: SmtpAccountOrderByWithRelationInput | SmtpAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SmtpAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SmtpAccounts
    **/
    _count?: true | SmtpAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SmtpAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SmtpAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SmtpAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SmtpAccountMaxAggregateInputType
  }

  export type GetSmtpAccountAggregateType<T extends SmtpAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateSmtpAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSmtpAccount[P]>
      : GetScalarType<T[P], AggregateSmtpAccount[P]>
  }




  export type SmtpAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SmtpAccountWhereInput
    orderBy?: SmtpAccountOrderByWithAggregationInput | SmtpAccountOrderByWithAggregationInput[]
    by: SmtpAccountScalarFieldEnum[] | SmtpAccountScalarFieldEnum
    having?: SmtpAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SmtpAccountCountAggregateInputType | true
    _avg?: SmtpAccountAvgAggregateInputType
    _sum?: SmtpAccountSumAggregateInputType
    _min?: SmtpAccountMinAggregateInputType
    _max?: SmtpAccountMaxAggregateInputType
  }

  export type SmtpAccountGroupByOutputType = {
    id: string
    tenantId: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status: $Enums.SenderStatus
    perMinuteLimit: number
    perDayLimit: number
    sentTodayCount: number
    sentTodayResetAt: Date | null
    lastSuccessAt: Date | null
    lastErrorAt: Date | null
    errorStreak: number
    healthScore: number
    createdAt: Date
    updatedAt: Date
    _count: SmtpAccountCountAggregateOutputType | null
    _avg: SmtpAccountAvgAggregateOutputType | null
    _sum: SmtpAccountSumAggregateOutputType | null
    _min: SmtpAccountMinAggregateOutputType | null
    _max: SmtpAccountMaxAggregateOutputType | null
  }

  type GetSmtpAccountGroupByPayload<T extends SmtpAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SmtpAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SmtpAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SmtpAccountGroupByOutputType[P]>
            : GetScalarType<T[P], SmtpAccountGroupByOutputType[P]>
        }
      >
    >


  export type SmtpAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    label?: boolean
    gmailAddress?: boolean
    encryptedAppPassword?: boolean
    iv?: boolean
    authTag?: boolean
    keyVersion?: boolean
    status?: boolean
    perMinuteLimit?: boolean
    perDayLimit?: boolean
    sentTodayCount?: boolean
    sentTodayResetAt?: boolean
    lastSuccessAt?: boolean
    lastErrorAt?: boolean
    errorStreak?: boolean
    healthScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    permissions?: boolean | SmtpAccount$permissionsArgs<ExtArgs>
    messages?: boolean | SmtpAccount$messagesArgs<ExtArgs>
    _count?: boolean | SmtpAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["smtpAccount"]>

  export type SmtpAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    label?: boolean
    gmailAddress?: boolean
    encryptedAppPassword?: boolean
    iv?: boolean
    authTag?: boolean
    keyVersion?: boolean
    status?: boolean
    perMinuteLimit?: boolean
    perDayLimit?: boolean
    sentTodayCount?: boolean
    sentTodayResetAt?: boolean
    lastSuccessAt?: boolean
    lastErrorAt?: boolean
    errorStreak?: boolean
    healthScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["smtpAccount"]>

  export type SmtpAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    label?: boolean
    gmailAddress?: boolean
    encryptedAppPassword?: boolean
    iv?: boolean
    authTag?: boolean
    keyVersion?: boolean
    status?: boolean
    perMinuteLimit?: boolean
    perDayLimit?: boolean
    sentTodayCount?: boolean
    sentTodayResetAt?: boolean
    lastSuccessAt?: boolean
    lastErrorAt?: boolean
    errorStreak?: boolean
    healthScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["smtpAccount"]>

  export type SmtpAccountSelectScalar = {
    id?: boolean
    tenantId?: boolean
    label?: boolean
    gmailAddress?: boolean
    encryptedAppPassword?: boolean
    iv?: boolean
    authTag?: boolean
    keyVersion?: boolean
    status?: boolean
    perMinuteLimit?: boolean
    perDayLimit?: boolean
    sentTodayCount?: boolean
    sentTodayResetAt?: boolean
    lastSuccessAt?: boolean
    lastErrorAt?: boolean
    errorStreak?: boolean
    healthScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SmtpAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "label" | "gmailAddress" | "encryptedAppPassword" | "iv" | "authTag" | "keyVersion" | "status" | "perMinuteLimit" | "perDayLimit" | "sentTodayCount" | "sentTodayResetAt" | "lastSuccessAt" | "lastErrorAt" | "errorStreak" | "healthScore" | "createdAt" | "updatedAt", ExtArgs["result"]["smtpAccount"]>
  export type SmtpAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    permissions?: boolean | SmtpAccount$permissionsArgs<ExtArgs>
    messages?: boolean | SmtpAccount$messagesArgs<ExtArgs>
    _count?: boolean | SmtpAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SmtpAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type SmtpAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $SmtpAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SmtpAccount"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      permissions: Prisma.$ApiKeyPermissionPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      label: string
      gmailAddress: string
      encryptedAppPassword: string
      iv: string
      authTag: string
      keyVersion: string
      status: $Enums.SenderStatus
      perMinuteLimit: number
      perDayLimit: number
      sentTodayCount: number
      sentTodayResetAt: Date | null
      lastSuccessAt: Date | null
      lastErrorAt: Date | null
      errorStreak: number
      healthScore: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["smtpAccount"]>
    composites: {}
  }

  type SmtpAccountGetPayload<S extends boolean | null | undefined | SmtpAccountDefaultArgs> = $Result.GetResult<Prisma.$SmtpAccountPayload, S>

  type SmtpAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SmtpAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SmtpAccountCountAggregateInputType | true
    }

  export interface SmtpAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SmtpAccount'], meta: { name: 'SmtpAccount' } }
    /**
     * Find zero or one SmtpAccount that matches the filter.
     * @param {SmtpAccountFindUniqueArgs} args - Arguments to find a SmtpAccount
     * @example
     * // Get one SmtpAccount
     * const smtpAccount = await prisma.smtpAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SmtpAccountFindUniqueArgs>(args: SelectSubset<T, SmtpAccountFindUniqueArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SmtpAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SmtpAccountFindUniqueOrThrowArgs} args - Arguments to find a SmtpAccount
     * @example
     * // Get one SmtpAccount
     * const smtpAccount = await prisma.smtpAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SmtpAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, SmtpAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SmtpAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpAccountFindFirstArgs} args - Arguments to find a SmtpAccount
     * @example
     * // Get one SmtpAccount
     * const smtpAccount = await prisma.smtpAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SmtpAccountFindFirstArgs>(args?: SelectSubset<T, SmtpAccountFindFirstArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SmtpAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpAccountFindFirstOrThrowArgs} args - Arguments to find a SmtpAccount
     * @example
     * // Get one SmtpAccount
     * const smtpAccount = await prisma.smtpAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SmtpAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, SmtpAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SmtpAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SmtpAccounts
     * const smtpAccounts = await prisma.smtpAccount.findMany()
     * 
     * // Get first 10 SmtpAccounts
     * const smtpAccounts = await prisma.smtpAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const smtpAccountWithIdOnly = await prisma.smtpAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SmtpAccountFindManyArgs>(args?: SelectSubset<T, SmtpAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SmtpAccount.
     * @param {SmtpAccountCreateArgs} args - Arguments to create a SmtpAccount.
     * @example
     * // Create one SmtpAccount
     * const SmtpAccount = await prisma.smtpAccount.create({
     *   data: {
     *     // ... data to create a SmtpAccount
     *   }
     * })
     * 
     */
    create<T extends SmtpAccountCreateArgs>(args: SelectSubset<T, SmtpAccountCreateArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SmtpAccounts.
     * @param {SmtpAccountCreateManyArgs} args - Arguments to create many SmtpAccounts.
     * @example
     * // Create many SmtpAccounts
     * const smtpAccount = await prisma.smtpAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SmtpAccountCreateManyArgs>(args?: SelectSubset<T, SmtpAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SmtpAccounts and returns the data saved in the database.
     * @param {SmtpAccountCreateManyAndReturnArgs} args - Arguments to create many SmtpAccounts.
     * @example
     * // Create many SmtpAccounts
     * const smtpAccount = await prisma.smtpAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SmtpAccounts and only return the `id`
     * const smtpAccountWithIdOnly = await prisma.smtpAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SmtpAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, SmtpAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SmtpAccount.
     * @param {SmtpAccountDeleteArgs} args - Arguments to delete one SmtpAccount.
     * @example
     * // Delete one SmtpAccount
     * const SmtpAccount = await prisma.smtpAccount.delete({
     *   where: {
     *     // ... filter to delete one SmtpAccount
     *   }
     * })
     * 
     */
    delete<T extends SmtpAccountDeleteArgs>(args: SelectSubset<T, SmtpAccountDeleteArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SmtpAccount.
     * @param {SmtpAccountUpdateArgs} args - Arguments to update one SmtpAccount.
     * @example
     * // Update one SmtpAccount
     * const smtpAccount = await prisma.smtpAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SmtpAccountUpdateArgs>(args: SelectSubset<T, SmtpAccountUpdateArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SmtpAccounts.
     * @param {SmtpAccountDeleteManyArgs} args - Arguments to filter SmtpAccounts to delete.
     * @example
     * // Delete a few SmtpAccounts
     * const { count } = await prisma.smtpAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SmtpAccountDeleteManyArgs>(args?: SelectSubset<T, SmtpAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SmtpAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SmtpAccounts
     * const smtpAccount = await prisma.smtpAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SmtpAccountUpdateManyArgs>(args: SelectSubset<T, SmtpAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SmtpAccounts and returns the data updated in the database.
     * @param {SmtpAccountUpdateManyAndReturnArgs} args - Arguments to update many SmtpAccounts.
     * @example
     * // Update many SmtpAccounts
     * const smtpAccount = await prisma.smtpAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SmtpAccounts and only return the `id`
     * const smtpAccountWithIdOnly = await prisma.smtpAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SmtpAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, SmtpAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SmtpAccount.
     * @param {SmtpAccountUpsertArgs} args - Arguments to update or create a SmtpAccount.
     * @example
     * // Update or create a SmtpAccount
     * const smtpAccount = await prisma.smtpAccount.upsert({
     *   create: {
     *     // ... data to create a SmtpAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SmtpAccount we want to update
     *   }
     * })
     */
    upsert<T extends SmtpAccountUpsertArgs>(args: SelectSubset<T, SmtpAccountUpsertArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SmtpAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpAccountCountArgs} args - Arguments to filter SmtpAccounts to count.
     * @example
     * // Count the number of SmtpAccounts
     * const count = await prisma.smtpAccount.count({
     *   where: {
     *     // ... the filter for the SmtpAccounts we want to count
     *   }
     * })
    **/
    count<T extends SmtpAccountCountArgs>(
      args?: Subset<T, SmtpAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SmtpAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SmtpAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SmtpAccountAggregateArgs>(args: Subset<T, SmtpAccountAggregateArgs>): Prisma.PrismaPromise<GetSmtpAccountAggregateType<T>>

    /**
     * Group by SmtpAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SmtpAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SmtpAccountGroupByArgs['orderBy'] }
        : { orderBy?: SmtpAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SmtpAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSmtpAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SmtpAccount model
   */
  readonly fields: SmtpAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SmtpAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SmtpAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    permissions<T extends SmtpAccount$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, SmtpAccount$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends SmtpAccount$messagesArgs<ExtArgs> = {}>(args?: Subset<T, SmtpAccount$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SmtpAccount model
   */
  interface SmtpAccountFieldRefs {
    readonly id: FieldRef<"SmtpAccount", 'String'>
    readonly tenantId: FieldRef<"SmtpAccount", 'String'>
    readonly label: FieldRef<"SmtpAccount", 'String'>
    readonly gmailAddress: FieldRef<"SmtpAccount", 'String'>
    readonly encryptedAppPassword: FieldRef<"SmtpAccount", 'String'>
    readonly iv: FieldRef<"SmtpAccount", 'String'>
    readonly authTag: FieldRef<"SmtpAccount", 'String'>
    readonly keyVersion: FieldRef<"SmtpAccount", 'String'>
    readonly status: FieldRef<"SmtpAccount", 'SenderStatus'>
    readonly perMinuteLimit: FieldRef<"SmtpAccount", 'Int'>
    readonly perDayLimit: FieldRef<"SmtpAccount", 'Int'>
    readonly sentTodayCount: FieldRef<"SmtpAccount", 'Int'>
    readonly sentTodayResetAt: FieldRef<"SmtpAccount", 'DateTime'>
    readonly lastSuccessAt: FieldRef<"SmtpAccount", 'DateTime'>
    readonly lastErrorAt: FieldRef<"SmtpAccount", 'DateTime'>
    readonly errorStreak: FieldRef<"SmtpAccount", 'Int'>
    readonly healthScore: FieldRef<"SmtpAccount", 'Int'>
    readonly createdAt: FieldRef<"SmtpAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"SmtpAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SmtpAccount findUnique
   */
  export type SmtpAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * Filter, which SmtpAccount to fetch.
     */
    where: SmtpAccountWhereUniqueInput
  }

  /**
   * SmtpAccount findUniqueOrThrow
   */
  export type SmtpAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * Filter, which SmtpAccount to fetch.
     */
    where: SmtpAccountWhereUniqueInput
  }

  /**
   * SmtpAccount findFirst
   */
  export type SmtpAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * Filter, which SmtpAccount to fetch.
     */
    where?: SmtpAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpAccounts to fetch.
     */
    orderBy?: SmtpAccountOrderByWithRelationInput | SmtpAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SmtpAccounts.
     */
    cursor?: SmtpAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmtpAccounts.
     */
    distinct?: SmtpAccountScalarFieldEnum | SmtpAccountScalarFieldEnum[]
  }

  /**
   * SmtpAccount findFirstOrThrow
   */
  export type SmtpAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * Filter, which SmtpAccount to fetch.
     */
    where?: SmtpAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpAccounts to fetch.
     */
    orderBy?: SmtpAccountOrderByWithRelationInput | SmtpAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SmtpAccounts.
     */
    cursor?: SmtpAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmtpAccounts.
     */
    distinct?: SmtpAccountScalarFieldEnum | SmtpAccountScalarFieldEnum[]
  }

  /**
   * SmtpAccount findMany
   */
  export type SmtpAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * Filter, which SmtpAccounts to fetch.
     */
    where?: SmtpAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpAccounts to fetch.
     */
    orderBy?: SmtpAccountOrderByWithRelationInput | SmtpAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SmtpAccounts.
     */
    cursor?: SmtpAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpAccounts.
     */
    skip?: number
    distinct?: SmtpAccountScalarFieldEnum | SmtpAccountScalarFieldEnum[]
  }

  /**
   * SmtpAccount create
   */
  export type SmtpAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a SmtpAccount.
     */
    data: XOR<SmtpAccountCreateInput, SmtpAccountUncheckedCreateInput>
  }

  /**
   * SmtpAccount createMany
   */
  export type SmtpAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SmtpAccounts.
     */
    data: SmtpAccountCreateManyInput | SmtpAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SmtpAccount createManyAndReturn
   */
  export type SmtpAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * The data used to create many SmtpAccounts.
     */
    data: SmtpAccountCreateManyInput | SmtpAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SmtpAccount update
   */
  export type SmtpAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a SmtpAccount.
     */
    data: XOR<SmtpAccountUpdateInput, SmtpAccountUncheckedUpdateInput>
    /**
     * Choose, which SmtpAccount to update.
     */
    where: SmtpAccountWhereUniqueInput
  }

  /**
   * SmtpAccount updateMany
   */
  export type SmtpAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SmtpAccounts.
     */
    data: XOR<SmtpAccountUpdateManyMutationInput, SmtpAccountUncheckedUpdateManyInput>
    /**
     * Filter which SmtpAccounts to update
     */
    where?: SmtpAccountWhereInput
    /**
     * Limit how many SmtpAccounts to update.
     */
    limit?: number
  }

  /**
   * SmtpAccount updateManyAndReturn
   */
  export type SmtpAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * The data used to update SmtpAccounts.
     */
    data: XOR<SmtpAccountUpdateManyMutationInput, SmtpAccountUncheckedUpdateManyInput>
    /**
     * Filter which SmtpAccounts to update
     */
    where?: SmtpAccountWhereInput
    /**
     * Limit how many SmtpAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SmtpAccount upsert
   */
  export type SmtpAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the SmtpAccount to update in case it exists.
     */
    where: SmtpAccountWhereUniqueInput
    /**
     * In case the SmtpAccount found by the `where` argument doesn't exist, create a new SmtpAccount with this data.
     */
    create: XOR<SmtpAccountCreateInput, SmtpAccountUncheckedCreateInput>
    /**
     * In case the SmtpAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SmtpAccountUpdateInput, SmtpAccountUncheckedUpdateInput>
  }

  /**
   * SmtpAccount delete
   */
  export type SmtpAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
    /**
     * Filter which SmtpAccount to delete.
     */
    where: SmtpAccountWhereUniqueInput
  }

  /**
   * SmtpAccount deleteMany
   */
  export type SmtpAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SmtpAccounts to delete
     */
    where?: SmtpAccountWhereInput
    /**
     * Limit how many SmtpAccounts to delete.
     */
    limit?: number
  }

  /**
   * SmtpAccount.permissions
   */
  export type SmtpAccount$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    where?: ApiKeyPermissionWhereInput
    orderBy?: ApiKeyPermissionOrderByWithRelationInput | ApiKeyPermissionOrderByWithRelationInput[]
    cursor?: ApiKeyPermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyPermissionScalarFieldEnum | ApiKeyPermissionScalarFieldEnum[]
  }

  /**
   * SmtpAccount.messages
   */
  export type SmtpAccount$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * SmtpAccount without action
   */
  export type SmtpAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpAccount
     */
    select?: SmtpAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpAccount
     */
    omit?: SmtpAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SmtpAccountInclude<ExtArgs> | null
  }


  /**
   * Model ApiKey
   */

  export type AggregateApiKey = {
    _count: ApiKeyCountAggregateOutputType | null
    _avg: ApiKeyAvgAggregateOutputType | null
    _sum: ApiKeySumAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  export type ApiKeyAvgAggregateOutputType = {
    rateLimitPerMinute: number | null
  }

  export type ApiKeySumAggregateOutputType = {
    rateLimitPerMinute: number | null
  }

  export type ApiKeyMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    keyHash: string | null
    prefix: string | null
    status: $Enums.ApiKeyStatus | null
    createdAt: Date | null
    revokedAt: Date | null
    rateLimitPerMinute: number | null
  }

  export type ApiKeyMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    keyHash: string | null
    prefix: string | null
    status: $Enums.ApiKeyStatus | null
    createdAt: Date | null
    revokedAt: Date | null
    rateLimitPerMinute: number | null
  }

  export type ApiKeyCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    keyHash: number
    prefix: number
    status: number
    createdAt: number
    revokedAt: number
    rateLimitPerMinute: number
    allowedIps: number
    _all: number
  }


  export type ApiKeyAvgAggregateInputType = {
    rateLimitPerMinute?: true
  }

  export type ApiKeySumAggregateInputType = {
    rateLimitPerMinute?: true
  }

  export type ApiKeyMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    keyHash?: true
    prefix?: true
    status?: true
    createdAt?: true
    revokedAt?: true
    rateLimitPerMinute?: true
  }

  export type ApiKeyMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    keyHash?: true
    prefix?: true
    status?: true
    createdAt?: true
    revokedAt?: true
    rateLimitPerMinute?: true
  }

  export type ApiKeyCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    keyHash?: true
    prefix?: true
    status?: true
    createdAt?: true
    revokedAt?: true
    rateLimitPerMinute?: true
    allowedIps?: true
    _all?: true
  }

  export type ApiKeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKey to aggregate.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiKeys
    **/
    _count?: true | ApiKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApiKeyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApiKeySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiKeyMaxAggregateInputType
  }

  export type GetApiKeyAggregateType<T extends ApiKeyAggregateArgs> = {
        [P in keyof T & keyof AggregateApiKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiKey[P]>
      : GetScalarType<T[P], AggregateApiKey[P]>
  }




  export type ApiKeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithAggregationInput | ApiKeyOrderByWithAggregationInput[]
    by: ApiKeyScalarFieldEnum[] | ApiKeyScalarFieldEnum
    having?: ApiKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiKeyCountAggregateInputType | true
    _avg?: ApiKeyAvgAggregateInputType
    _sum?: ApiKeySumAggregateInputType
    _min?: ApiKeyMinAggregateInputType
    _max?: ApiKeyMaxAggregateInputType
  }

  export type ApiKeyGroupByOutputType = {
    id: string
    tenantId: string
    name: string
    keyHash: string
    prefix: string
    status: $Enums.ApiKeyStatus
    createdAt: Date
    revokedAt: Date | null
    rateLimitPerMinute: number
    allowedIps: JsonValue | null
    _count: ApiKeyCountAggregateOutputType | null
    _avg: ApiKeyAvgAggregateOutputType | null
    _sum: ApiKeySumAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  type GetApiKeyGroupByPayload<T extends ApiKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiKeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiKeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
            : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
        }
      >
    >


  export type ApiKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    keyHash?: boolean
    prefix?: boolean
    status?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    rateLimitPerMinute?: boolean
    allowedIps?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    permissions?: boolean | ApiKey$permissionsArgs<ExtArgs>
    messages?: boolean | ApiKey$messagesArgs<ExtArgs>
    _count?: boolean | ApiKeyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    keyHash?: boolean
    prefix?: boolean
    status?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    rateLimitPerMinute?: boolean
    allowedIps?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    keyHash?: boolean
    prefix?: boolean
    status?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    rateLimitPerMinute?: boolean
    allowedIps?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    keyHash?: boolean
    prefix?: boolean
    status?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    rateLimitPerMinute?: boolean
    allowedIps?: boolean
  }

  export type ApiKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "keyHash" | "prefix" | "status" | "createdAt" | "revokedAt" | "rateLimitPerMinute" | "allowedIps", ExtArgs["result"]["apiKey"]>
  export type ApiKeyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    permissions?: boolean | ApiKey$permissionsArgs<ExtArgs>
    messages?: boolean | ApiKey$messagesArgs<ExtArgs>
    _count?: boolean | ApiKeyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ApiKeyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ApiKeyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $ApiKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiKey"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      permissions: Prisma.$ApiKeyPermissionPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      name: string
      keyHash: string
      prefix: string
      status: $Enums.ApiKeyStatus
      createdAt: Date
      revokedAt: Date | null
      rateLimitPerMinute: number
      allowedIps: Prisma.JsonValue | null
    }, ExtArgs["result"]["apiKey"]>
    composites: {}
  }

  type ApiKeyGetPayload<S extends boolean | null | undefined | ApiKeyDefaultArgs> = $Result.GetResult<Prisma.$ApiKeyPayload, S>

  type ApiKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiKeyCountAggregateInputType | true
    }

  export interface ApiKeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiKey'], meta: { name: 'ApiKey' } }
    /**
     * Find zero or one ApiKey that matches the filter.
     * @param {ApiKeyFindUniqueArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiKeyFindUniqueArgs>(args: SelectSubset<T, ApiKeyFindUniqueArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiKeyFindUniqueOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiKeyFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiKeyFindFirstArgs>(args?: SelectSubset<T, ApiKeyFindFirstArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiKeyFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiKeys
     * const apiKeys = await prisma.apiKey.findMany()
     * 
     * // Get first 10 ApiKeys
     * const apiKeys = await prisma.apiKey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiKeyFindManyArgs>(args?: SelectSubset<T, ApiKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiKey.
     * @param {ApiKeyCreateArgs} args - Arguments to create a ApiKey.
     * @example
     * // Create one ApiKey
     * const ApiKey = await prisma.apiKey.create({
     *   data: {
     *     // ... data to create a ApiKey
     *   }
     * })
     * 
     */
    create<T extends ApiKeyCreateArgs>(args: SelectSubset<T, ApiKeyCreateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiKeys.
     * @param {ApiKeyCreateManyArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiKeyCreateManyArgs>(args?: SelectSubset<T, ApiKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiKeys and returns the data saved in the database.
     * @param {ApiKeyCreateManyAndReturnArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiKeyCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiKey.
     * @param {ApiKeyDeleteArgs} args - Arguments to delete one ApiKey.
     * @example
     * // Delete one ApiKey
     * const ApiKey = await prisma.apiKey.delete({
     *   where: {
     *     // ... filter to delete one ApiKey
     *   }
     * })
     * 
     */
    delete<T extends ApiKeyDeleteArgs>(args: SelectSubset<T, ApiKeyDeleteArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiKey.
     * @param {ApiKeyUpdateArgs} args - Arguments to update one ApiKey.
     * @example
     * // Update one ApiKey
     * const apiKey = await prisma.apiKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiKeyUpdateArgs>(args: SelectSubset<T, ApiKeyUpdateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiKeys.
     * @param {ApiKeyDeleteManyArgs} args - Arguments to filter ApiKeys to delete.
     * @example
     * // Delete a few ApiKeys
     * const { count } = await prisma.apiKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiKeyDeleteManyArgs>(args?: SelectSubset<T, ApiKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiKeyUpdateManyArgs>(args: SelectSubset<T, ApiKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys and returns the data updated in the database.
     * @param {ApiKeyUpdateManyAndReturnArgs} args - Arguments to update many ApiKeys.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiKeyUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiKey.
     * @param {ApiKeyUpsertArgs} args - Arguments to update or create a ApiKey.
     * @example
     * // Update or create a ApiKey
     * const apiKey = await prisma.apiKey.upsert({
     *   create: {
     *     // ... data to create a ApiKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiKey we want to update
     *   }
     * })
     */
    upsert<T extends ApiKeyUpsertArgs>(args: SelectSubset<T, ApiKeyUpsertArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyCountArgs} args - Arguments to filter ApiKeys to count.
     * @example
     * // Count the number of ApiKeys
     * const count = await prisma.apiKey.count({
     *   where: {
     *     // ... the filter for the ApiKeys we want to count
     *   }
     * })
    **/
    count<T extends ApiKeyCountArgs>(
      args?: Subset<T, ApiKeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiKeyAggregateArgs>(args: Subset<T, ApiKeyAggregateArgs>): Prisma.PrismaPromise<GetApiKeyAggregateType<T>>

    /**
     * Group by ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiKeyGroupByArgs['orderBy'] }
        : { orderBy?: ApiKeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiKey model
   */
  readonly fields: ApiKeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiKeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    permissions<T extends ApiKey$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, ApiKey$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends ApiKey$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ApiKey$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiKey model
   */
  interface ApiKeyFieldRefs {
    readonly id: FieldRef<"ApiKey", 'String'>
    readonly tenantId: FieldRef<"ApiKey", 'String'>
    readonly name: FieldRef<"ApiKey", 'String'>
    readonly keyHash: FieldRef<"ApiKey", 'String'>
    readonly prefix: FieldRef<"ApiKey", 'String'>
    readonly status: FieldRef<"ApiKey", 'ApiKeyStatus'>
    readonly createdAt: FieldRef<"ApiKey", 'DateTime'>
    readonly revokedAt: FieldRef<"ApiKey", 'DateTime'>
    readonly rateLimitPerMinute: FieldRef<"ApiKey", 'Int'>
    readonly allowedIps: FieldRef<"ApiKey", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * ApiKey findUnique
   */
  export type ApiKeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findUniqueOrThrow
   */
  export type ApiKeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findFirst
   */
  export type ApiKeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findFirstOrThrow
   */
  export type ApiKeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findMany
   */
  export type ApiKeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeys to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey create
   */
  export type ApiKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to create a ApiKey.
     */
    data: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
  }

  /**
   * ApiKey createMany
   */
  export type ApiKeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey createManyAndReturn
   */
  export type ApiKeyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKey update
   */
  export type ApiKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to update a ApiKey.
     */
    data: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
    /**
     * Choose, which ApiKey to update.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey updateMany
   */
  export type ApiKeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey updateManyAndReturn
   */
  export type ApiKeyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKey upsert
   */
  export type ApiKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The filter to search for the ApiKey to update in case it exists.
     */
    where: ApiKeyWhereUniqueInput
    /**
     * In case the ApiKey found by the `where` argument doesn't exist, create a new ApiKey with this data.
     */
    create: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
    /**
     * In case the ApiKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
  }

  /**
   * ApiKey delete
   */
  export type ApiKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter which ApiKey to delete.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey deleteMany
   */
  export type ApiKeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeys to delete
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to delete.
     */
    limit?: number
  }

  /**
   * ApiKey.permissions
   */
  export type ApiKey$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    where?: ApiKeyPermissionWhereInput
    orderBy?: ApiKeyPermissionOrderByWithRelationInput | ApiKeyPermissionOrderByWithRelationInput[]
    cursor?: ApiKeyPermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyPermissionScalarFieldEnum | ApiKeyPermissionScalarFieldEnum[]
  }

  /**
   * ApiKey.messages
   */
  export type ApiKey$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * ApiKey without action
   */
  export type ApiKeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
  }


  /**
   * Model ApiKeyPermission
   */

  export type AggregateApiKeyPermission = {
    _count: ApiKeyPermissionCountAggregateOutputType | null
    _min: ApiKeyPermissionMinAggregateOutputType | null
    _max: ApiKeyPermissionMaxAggregateOutputType | null
  }

  export type ApiKeyPermissionMinAggregateOutputType = {
    apiKeyId: string | null
    smtpAccountId: string | null
  }

  export type ApiKeyPermissionMaxAggregateOutputType = {
    apiKeyId: string | null
    smtpAccountId: string | null
  }

  export type ApiKeyPermissionCountAggregateOutputType = {
    apiKeyId: number
    smtpAccountId: number
    _all: number
  }


  export type ApiKeyPermissionMinAggregateInputType = {
    apiKeyId?: true
    smtpAccountId?: true
  }

  export type ApiKeyPermissionMaxAggregateInputType = {
    apiKeyId?: true
    smtpAccountId?: true
  }

  export type ApiKeyPermissionCountAggregateInputType = {
    apiKeyId?: true
    smtpAccountId?: true
    _all?: true
  }

  export type ApiKeyPermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeyPermission to aggregate.
     */
    where?: ApiKeyPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeyPermissions to fetch.
     */
    orderBy?: ApiKeyPermissionOrderByWithRelationInput | ApiKeyPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiKeyPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeyPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeyPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiKeyPermissions
    **/
    _count?: true | ApiKeyPermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiKeyPermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiKeyPermissionMaxAggregateInputType
  }

  export type GetApiKeyPermissionAggregateType<T extends ApiKeyPermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateApiKeyPermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiKeyPermission[P]>
      : GetScalarType<T[P], AggregateApiKeyPermission[P]>
  }




  export type ApiKeyPermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyPermissionWhereInput
    orderBy?: ApiKeyPermissionOrderByWithAggregationInput | ApiKeyPermissionOrderByWithAggregationInput[]
    by: ApiKeyPermissionScalarFieldEnum[] | ApiKeyPermissionScalarFieldEnum
    having?: ApiKeyPermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiKeyPermissionCountAggregateInputType | true
    _min?: ApiKeyPermissionMinAggregateInputType
    _max?: ApiKeyPermissionMaxAggregateInputType
  }

  export type ApiKeyPermissionGroupByOutputType = {
    apiKeyId: string
    smtpAccountId: string
    _count: ApiKeyPermissionCountAggregateOutputType | null
    _min: ApiKeyPermissionMinAggregateOutputType | null
    _max: ApiKeyPermissionMaxAggregateOutputType | null
  }

  type GetApiKeyPermissionGroupByPayload<T extends ApiKeyPermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiKeyPermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiKeyPermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiKeyPermissionGroupByOutputType[P]>
            : GetScalarType<T[P], ApiKeyPermissionGroupByOutputType[P]>
        }
      >
    >


  export type ApiKeyPermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    apiKeyId?: boolean
    smtpAccountId?: boolean
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKeyPermission"]>

  export type ApiKeyPermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    apiKeyId?: boolean
    smtpAccountId?: boolean
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKeyPermission"]>

  export type ApiKeyPermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    apiKeyId?: boolean
    smtpAccountId?: boolean
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKeyPermission"]>

  export type ApiKeyPermissionSelectScalar = {
    apiKeyId?: boolean
    smtpAccountId?: boolean
  }

  export type ApiKeyPermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"apiKeyId" | "smtpAccountId", ExtArgs["result"]["apiKeyPermission"]>
  export type ApiKeyPermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }
  export type ApiKeyPermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }
  export type ApiKeyPermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }

  export type $ApiKeyPermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiKeyPermission"
    objects: {
      apiKey: Prisma.$ApiKeyPayload<ExtArgs>
      smtpAccount: Prisma.$SmtpAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      apiKeyId: string
      smtpAccountId: string
    }, ExtArgs["result"]["apiKeyPermission"]>
    composites: {}
  }

  type ApiKeyPermissionGetPayload<S extends boolean | null | undefined | ApiKeyPermissionDefaultArgs> = $Result.GetResult<Prisma.$ApiKeyPermissionPayload, S>

  type ApiKeyPermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiKeyPermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiKeyPermissionCountAggregateInputType | true
    }

  export interface ApiKeyPermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiKeyPermission'], meta: { name: 'ApiKeyPermission' } }
    /**
     * Find zero or one ApiKeyPermission that matches the filter.
     * @param {ApiKeyPermissionFindUniqueArgs} args - Arguments to find a ApiKeyPermission
     * @example
     * // Get one ApiKeyPermission
     * const apiKeyPermission = await prisma.apiKeyPermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiKeyPermissionFindUniqueArgs>(args: SelectSubset<T, ApiKeyPermissionFindUniqueArgs<ExtArgs>>): Prisma__ApiKeyPermissionClient<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiKeyPermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiKeyPermissionFindUniqueOrThrowArgs} args - Arguments to find a ApiKeyPermission
     * @example
     * // Get one ApiKeyPermission
     * const apiKeyPermission = await prisma.apiKeyPermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiKeyPermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiKeyPermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiKeyPermissionClient<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKeyPermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyPermissionFindFirstArgs} args - Arguments to find a ApiKeyPermission
     * @example
     * // Get one ApiKeyPermission
     * const apiKeyPermission = await prisma.apiKeyPermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiKeyPermissionFindFirstArgs>(args?: SelectSubset<T, ApiKeyPermissionFindFirstArgs<ExtArgs>>): Prisma__ApiKeyPermissionClient<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKeyPermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyPermissionFindFirstOrThrowArgs} args - Arguments to find a ApiKeyPermission
     * @example
     * // Get one ApiKeyPermission
     * const apiKeyPermission = await prisma.apiKeyPermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiKeyPermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiKeyPermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiKeyPermissionClient<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiKeyPermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyPermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiKeyPermissions
     * const apiKeyPermissions = await prisma.apiKeyPermission.findMany()
     * 
     * // Get first 10 ApiKeyPermissions
     * const apiKeyPermissions = await prisma.apiKeyPermission.findMany({ take: 10 })
     * 
     * // Only select the `apiKeyId`
     * const apiKeyPermissionWithApiKeyIdOnly = await prisma.apiKeyPermission.findMany({ select: { apiKeyId: true } })
     * 
     */
    findMany<T extends ApiKeyPermissionFindManyArgs>(args?: SelectSubset<T, ApiKeyPermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiKeyPermission.
     * @param {ApiKeyPermissionCreateArgs} args - Arguments to create a ApiKeyPermission.
     * @example
     * // Create one ApiKeyPermission
     * const ApiKeyPermission = await prisma.apiKeyPermission.create({
     *   data: {
     *     // ... data to create a ApiKeyPermission
     *   }
     * })
     * 
     */
    create<T extends ApiKeyPermissionCreateArgs>(args: SelectSubset<T, ApiKeyPermissionCreateArgs<ExtArgs>>): Prisma__ApiKeyPermissionClient<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiKeyPermissions.
     * @param {ApiKeyPermissionCreateManyArgs} args - Arguments to create many ApiKeyPermissions.
     * @example
     * // Create many ApiKeyPermissions
     * const apiKeyPermission = await prisma.apiKeyPermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiKeyPermissionCreateManyArgs>(args?: SelectSubset<T, ApiKeyPermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiKeyPermissions and returns the data saved in the database.
     * @param {ApiKeyPermissionCreateManyAndReturnArgs} args - Arguments to create many ApiKeyPermissions.
     * @example
     * // Create many ApiKeyPermissions
     * const apiKeyPermission = await prisma.apiKeyPermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiKeyPermissions and only return the `apiKeyId`
     * const apiKeyPermissionWithApiKeyIdOnly = await prisma.apiKeyPermission.createManyAndReturn({
     *   select: { apiKeyId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiKeyPermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiKeyPermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiKeyPermission.
     * @param {ApiKeyPermissionDeleteArgs} args - Arguments to delete one ApiKeyPermission.
     * @example
     * // Delete one ApiKeyPermission
     * const ApiKeyPermission = await prisma.apiKeyPermission.delete({
     *   where: {
     *     // ... filter to delete one ApiKeyPermission
     *   }
     * })
     * 
     */
    delete<T extends ApiKeyPermissionDeleteArgs>(args: SelectSubset<T, ApiKeyPermissionDeleteArgs<ExtArgs>>): Prisma__ApiKeyPermissionClient<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiKeyPermission.
     * @param {ApiKeyPermissionUpdateArgs} args - Arguments to update one ApiKeyPermission.
     * @example
     * // Update one ApiKeyPermission
     * const apiKeyPermission = await prisma.apiKeyPermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiKeyPermissionUpdateArgs>(args: SelectSubset<T, ApiKeyPermissionUpdateArgs<ExtArgs>>): Prisma__ApiKeyPermissionClient<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiKeyPermissions.
     * @param {ApiKeyPermissionDeleteManyArgs} args - Arguments to filter ApiKeyPermissions to delete.
     * @example
     * // Delete a few ApiKeyPermissions
     * const { count } = await prisma.apiKeyPermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiKeyPermissionDeleteManyArgs>(args?: SelectSubset<T, ApiKeyPermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeyPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyPermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiKeyPermissions
     * const apiKeyPermission = await prisma.apiKeyPermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiKeyPermissionUpdateManyArgs>(args: SelectSubset<T, ApiKeyPermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeyPermissions and returns the data updated in the database.
     * @param {ApiKeyPermissionUpdateManyAndReturnArgs} args - Arguments to update many ApiKeyPermissions.
     * @example
     * // Update many ApiKeyPermissions
     * const apiKeyPermission = await prisma.apiKeyPermission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiKeyPermissions and only return the `apiKeyId`
     * const apiKeyPermissionWithApiKeyIdOnly = await prisma.apiKeyPermission.updateManyAndReturn({
     *   select: { apiKeyId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiKeyPermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiKeyPermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiKeyPermission.
     * @param {ApiKeyPermissionUpsertArgs} args - Arguments to update or create a ApiKeyPermission.
     * @example
     * // Update or create a ApiKeyPermission
     * const apiKeyPermission = await prisma.apiKeyPermission.upsert({
     *   create: {
     *     // ... data to create a ApiKeyPermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiKeyPermission we want to update
     *   }
     * })
     */
    upsert<T extends ApiKeyPermissionUpsertArgs>(args: SelectSubset<T, ApiKeyPermissionUpsertArgs<ExtArgs>>): Prisma__ApiKeyPermissionClient<$Result.GetResult<Prisma.$ApiKeyPermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiKeyPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyPermissionCountArgs} args - Arguments to filter ApiKeyPermissions to count.
     * @example
     * // Count the number of ApiKeyPermissions
     * const count = await prisma.apiKeyPermission.count({
     *   where: {
     *     // ... the filter for the ApiKeyPermissions we want to count
     *   }
     * })
    **/
    count<T extends ApiKeyPermissionCountArgs>(
      args?: Subset<T, ApiKeyPermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiKeyPermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiKeyPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyPermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiKeyPermissionAggregateArgs>(args: Subset<T, ApiKeyPermissionAggregateArgs>): Prisma.PrismaPromise<GetApiKeyPermissionAggregateType<T>>

    /**
     * Group by ApiKeyPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyPermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiKeyPermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiKeyPermissionGroupByArgs['orderBy'] }
        : { orderBy?: ApiKeyPermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiKeyPermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiKeyPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiKeyPermission model
   */
  readonly fields: ApiKeyPermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiKeyPermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiKeyPermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    apiKey<T extends ApiKeyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ApiKeyDefaultArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    smtpAccount<T extends SmtpAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SmtpAccountDefaultArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiKeyPermission model
   */
  interface ApiKeyPermissionFieldRefs {
    readonly apiKeyId: FieldRef<"ApiKeyPermission", 'String'>
    readonly smtpAccountId: FieldRef<"ApiKeyPermission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ApiKeyPermission findUnique
   */
  export type ApiKeyPermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeyPermission to fetch.
     */
    where: ApiKeyPermissionWhereUniqueInput
  }

  /**
   * ApiKeyPermission findUniqueOrThrow
   */
  export type ApiKeyPermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeyPermission to fetch.
     */
    where: ApiKeyPermissionWhereUniqueInput
  }

  /**
   * ApiKeyPermission findFirst
   */
  export type ApiKeyPermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeyPermission to fetch.
     */
    where?: ApiKeyPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeyPermissions to fetch.
     */
    orderBy?: ApiKeyPermissionOrderByWithRelationInput | ApiKeyPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeyPermissions.
     */
    cursor?: ApiKeyPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeyPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeyPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeyPermissions.
     */
    distinct?: ApiKeyPermissionScalarFieldEnum | ApiKeyPermissionScalarFieldEnum[]
  }

  /**
   * ApiKeyPermission findFirstOrThrow
   */
  export type ApiKeyPermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeyPermission to fetch.
     */
    where?: ApiKeyPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeyPermissions to fetch.
     */
    orderBy?: ApiKeyPermissionOrderByWithRelationInput | ApiKeyPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeyPermissions.
     */
    cursor?: ApiKeyPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeyPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeyPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeyPermissions.
     */
    distinct?: ApiKeyPermissionScalarFieldEnum | ApiKeyPermissionScalarFieldEnum[]
  }

  /**
   * ApiKeyPermission findMany
   */
  export type ApiKeyPermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeyPermissions to fetch.
     */
    where?: ApiKeyPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeyPermissions to fetch.
     */
    orderBy?: ApiKeyPermissionOrderByWithRelationInput | ApiKeyPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiKeyPermissions.
     */
    cursor?: ApiKeyPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeyPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeyPermissions.
     */
    skip?: number
    distinct?: ApiKeyPermissionScalarFieldEnum | ApiKeyPermissionScalarFieldEnum[]
  }

  /**
   * ApiKeyPermission create
   */
  export type ApiKeyPermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a ApiKeyPermission.
     */
    data: XOR<ApiKeyPermissionCreateInput, ApiKeyPermissionUncheckedCreateInput>
  }

  /**
   * ApiKeyPermission createMany
   */
  export type ApiKeyPermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiKeyPermissions.
     */
    data: ApiKeyPermissionCreateManyInput | ApiKeyPermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKeyPermission createManyAndReturn
   */
  export type ApiKeyPermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * The data used to create many ApiKeyPermissions.
     */
    data: ApiKeyPermissionCreateManyInput | ApiKeyPermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKeyPermission update
   */
  export type ApiKeyPermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a ApiKeyPermission.
     */
    data: XOR<ApiKeyPermissionUpdateInput, ApiKeyPermissionUncheckedUpdateInput>
    /**
     * Choose, which ApiKeyPermission to update.
     */
    where: ApiKeyPermissionWhereUniqueInput
  }

  /**
   * ApiKeyPermission updateMany
   */
  export type ApiKeyPermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiKeyPermissions.
     */
    data: XOR<ApiKeyPermissionUpdateManyMutationInput, ApiKeyPermissionUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeyPermissions to update
     */
    where?: ApiKeyPermissionWhereInput
    /**
     * Limit how many ApiKeyPermissions to update.
     */
    limit?: number
  }

  /**
   * ApiKeyPermission updateManyAndReturn
   */
  export type ApiKeyPermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * The data used to update ApiKeyPermissions.
     */
    data: XOR<ApiKeyPermissionUpdateManyMutationInput, ApiKeyPermissionUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeyPermissions to update
     */
    where?: ApiKeyPermissionWhereInput
    /**
     * Limit how many ApiKeyPermissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKeyPermission upsert
   */
  export type ApiKeyPermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the ApiKeyPermission to update in case it exists.
     */
    where: ApiKeyPermissionWhereUniqueInput
    /**
     * In case the ApiKeyPermission found by the `where` argument doesn't exist, create a new ApiKeyPermission with this data.
     */
    create: XOR<ApiKeyPermissionCreateInput, ApiKeyPermissionUncheckedCreateInput>
    /**
     * In case the ApiKeyPermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiKeyPermissionUpdateInput, ApiKeyPermissionUncheckedUpdateInput>
  }

  /**
   * ApiKeyPermission delete
   */
  export type ApiKeyPermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
    /**
     * Filter which ApiKeyPermission to delete.
     */
    where: ApiKeyPermissionWhereUniqueInput
  }

  /**
   * ApiKeyPermission deleteMany
   */
  export type ApiKeyPermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeyPermissions to delete
     */
    where?: ApiKeyPermissionWhereInput
    /**
     * Limit how many ApiKeyPermissions to delete.
     */
    limit?: number
  }

  /**
   * ApiKeyPermission without action
   */
  export type ApiKeyPermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyPermission
     */
    select?: ApiKeyPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKeyPermission
     */
    omit?: ApiKeyPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyPermissionInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageAvgAggregateOutputType = {
    attempts: number | null
  }

  export type MessageSumAggregateOutputType = {
    attempts: number | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    apiKeyId: string | null
    smtpAccountId: string | null
    idempotencyKey: string | null
    subject: string | null
    text: string | null
    html: string | null
    fromName: string | null
    replyTo: string | null
    status: $Enums.MessageStatus | null
    attempts: number | null
    lastError: string | null
    createdAt: Date | null
    queuedAt: Date | null
    sentAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    apiKeyId: string | null
    smtpAccountId: string | null
    idempotencyKey: string | null
    subject: string | null
    text: string | null
    html: string | null
    fromName: string | null
    replyTo: string | null
    status: $Enums.MessageStatus | null
    attempts: number | null
    lastError: string | null
    createdAt: Date | null
    queuedAt: Date | null
    sentAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    tenantId: number
    apiKeyId: number
    smtpAccountId: number
    idempotencyKey: number
    to: number
    cc: number
    bcc: number
    subject: number
    text: number
    html: number
    fromName: number
    replyTo: number
    headers: number
    status: number
    attempts: number
    lastError: number
    createdAt: number
    queuedAt: number
    sentAt: number
    _all: number
  }


  export type MessageAvgAggregateInputType = {
    attempts?: true
  }

  export type MessageSumAggregateInputType = {
    attempts?: true
  }

  export type MessageMinAggregateInputType = {
    id?: true
    tenantId?: true
    apiKeyId?: true
    smtpAccountId?: true
    idempotencyKey?: true
    subject?: true
    text?: true
    html?: true
    fromName?: true
    replyTo?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
    queuedAt?: true
    sentAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    tenantId?: true
    apiKeyId?: true
    smtpAccountId?: true
    idempotencyKey?: true
    subject?: true
    text?: true
    html?: true
    fromName?: true
    replyTo?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
    queuedAt?: true
    sentAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    tenantId?: true
    apiKeyId?: true
    smtpAccountId?: true
    idempotencyKey?: true
    to?: true
    cc?: true
    bcc?: true
    subject?: true
    text?: true
    html?: true
    fromName?: true
    replyTo?: true
    headers?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
    queuedAt?: true
    sentAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _avg?: MessageAvgAggregateInputType
    _sum?: MessageSumAggregateInputType
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    tenantId: string
    apiKeyId: string
    smtpAccountId: string
    idempotencyKey: string
    to: JsonValue
    cc: JsonValue
    bcc: JsonValue
    subject: string
    text: string | null
    html: string | null
    fromName: string | null
    replyTo: string | null
    headers: JsonValue | null
    status: $Enums.MessageStatus
    attempts: number
    lastError: string | null
    createdAt: Date
    queuedAt: Date
    sentAt: Date | null
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    apiKeyId?: boolean
    smtpAccountId?: boolean
    idempotencyKey?: boolean
    to?: boolean
    cc?: boolean
    bcc?: boolean
    subject?: boolean
    text?: boolean
    html?: boolean
    fromName?: boolean
    replyTo?: boolean
    headers?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
    queuedAt?: boolean
    sentAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    apiKeyId?: boolean
    smtpAccountId?: boolean
    idempotencyKey?: boolean
    to?: boolean
    cc?: boolean
    bcc?: boolean
    subject?: boolean
    text?: boolean
    html?: boolean
    fromName?: boolean
    replyTo?: boolean
    headers?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
    queuedAt?: boolean
    sentAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    apiKeyId?: boolean
    smtpAccountId?: boolean
    idempotencyKey?: boolean
    to?: boolean
    cc?: boolean
    bcc?: boolean
    subject?: boolean
    text?: boolean
    html?: boolean
    fromName?: boolean
    replyTo?: boolean
    headers?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
    queuedAt?: boolean
    sentAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    tenantId?: boolean
    apiKeyId?: boolean
    smtpAccountId?: boolean
    idempotencyKey?: boolean
    to?: boolean
    cc?: boolean
    bcc?: boolean
    subject?: boolean
    text?: boolean
    html?: boolean
    fromName?: boolean
    replyTo?: boolean
    headers?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
    queuedAt?: boolean
    sentAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "apiKeyId" | "smtpAccountId" | "idempotencyKey" | "to" | "cc" | "bcc" | "subject" | "text" | "html" | "fromName" | "replyTo" | "headers" | "status" | "attempts" | "lastError" | "createdAt" | "queuedAt" | "sentAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    apiKey?: boolean | ApiKeyDefaultArgs<ExtArgs>
    smtpAccount?: boolean | SmtpAccountDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      apiKey: Prisma.$ApiKeyPayload<ExtArgs>
      smtpAccount: Prisma.$SmtpAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      apiKeyId: string
      smtpAccountId: string
      idempotencyKey: string
      to: Prisma.JsonValue
      cc: Prisma.JsonValue
      bcc: Prisma.JsonValue
      subject: string
      text: string | null
      html: string | null
      fromName: string | null
      replyTo: string | null
      headers: Prisma.JsonValue | null
      status: $Enums.MessageStatus
      attempts: number
      lastError: string | null
      createdAt: Date
      queuedAt: Date
      sentAt: Date | null
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    apiKey<T extends ApiKeyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ApiKeyDefaultArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    smtpAccount<T extends SmtpAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SmtpAccountDefaultArgs<ExtArgs>>): Prisma__SmtpAccountClient<$Result.GetResult<Prisma.$SmtpAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly tenantId: FieldRef<"Message", 'String'>
    readonly apiKeyId: FieldRef<"Message", 'String'>
    readonly smtpAccountId: FieldRef<"Message", 'String'>
    readonly idempotencyKey: FieldRef<"Message", 'String'>
    readonly to: FieldRef<"Message", 'Json'>
    readonly cc: FieldRef<"Message", 'Json'>
    readonly bcc: FieldRef<"Message", 'Json'>
    readonly subject: FieldRef<"Message", 'String'>
    readonly text: FieldRef<"Message", 'String'>
    readonly html: FieldRef<"Message", 'String'>
    readonly fromName: FieldRef<"Message", 'String'>
    readonly replyTo: FieldRef<"Message", 'String'>
    readonly headers: FieldRef<"Message", 'Json'>
    readonly status: FieldRef<"Message", 'MessageStatus'>
    readonly attempts: FieldRef<"Message", 'Int'>
    readonly lastError: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
    readonly queuedAt: FieldRef<"Message", 'DateTime'>
    readonly sentAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model Template
   */

  export type AggregateTemplate = {
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  export type TemplateMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    subject: string | null
    html: string | null
    text: string | null
    status: $Enums.TemplateStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemplateMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    subject: string | null
    html: string | null
    text: string | null
    status: $Enums.TemplateStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemplateCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    subject: number
    html: number
    text: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TemplateMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    subject?: true
    html?: true
    text?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemplateMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    subject?: true
    html?: true
    text?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemplateCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    subject?: true
    html?: true
    text?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Template to aggregate.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Templates
    **/
    _count?: true | TemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemplateMaxAggregateInputType
  }

  export type GetTemplateAggregateType<T extends TemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemplate[P]>
      : GetScalarType<T[P], AggregateTemplate[P]>
  }




  export type TemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithAggregationInput | TemplateOrderByWithAggregationInput[]
    by: TemplateScalarFieldEnum[] | TemplateScalarFieldEnum
    having?: TemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemplateCountAggregateInputType | true
    _min?: TemplateMinAggregateInputType
    _max?: TemplateMaxAggregateInputType
  }

  export type TemplateGroupByOutputType = {
    id: string
    tenantId: string
    name: string
    subject: string
    html: string
    text: string | null
    status: $Enums.TemplateStatus
    createdAt: Date
    updatedAt: Date
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  type GetTemplateGroupByPayload<T extends TemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TemplateGroupByOutputType[P]>
        }
      >
    >


  export type TemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    subject?: boolean
    html?: boolean
    text?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    subject?: boolean
    html?: boolean
    text?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    subject?: boolean
    html?: boolean
    text?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    subject?: boolean
    html?: boolean
    text?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "subject" | "html" | "text" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["template"]>
  export type TemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TemplateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Template"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      name: string
      subject: string
      html: string
      text: string | null
      status: $Enums.TemplateStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["template"]>
    composites: {}
  }

  type TemplateGetPayload<S extends boolean | null | undefined | TemplateDefaultArgs> = $Result.GetResult<Prisma.$TemplatePayload, S>

  type TemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TemplateCountAggregateInputType | true
    }

  export interface TemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Template'], meta: { name: 'Template' } }
    /**
     * Find zero or one Template that matches the filter.
     * @param {TemplateFindUniqueArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemplateFindUniqueArgs>(args: SelectSubset<T, TemplateFindUniqueArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Template that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TemplateFindUniqueOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Template that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemplateFindFirstArgs>(args?: SelectSubset<T, TemplateFindFirstArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Template that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Templates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Templates
     * const templates = await prisma.template.findMany()
     * 
     * // Get first 10 Templates
     * const templates = await prisma.template.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const templateWithIdOnly = await prisma.template.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemplateFindManyArgs>(args?: SelectSubset<T, TemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Template.
     * @param {TemplateCreateArgs} args - Arguments to create a Template.
     * @example
     * // Create one Template
     * const Template = await prisma.template.create({
     *   data: {
     *     // ... data to create a Template
     *   }
     * })
     * 
     */
    create<T extends TemplateCreateArgs>(args: SelectSubset<T, TemplateCreateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Templates.
     * @param {TemplateCreateManyArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemplateCreateManyArgs>(args?: SelectSubset<T, TemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Templates and returns the data saved in the database.
     * @param {TemplateCreateManyAndReturnArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, TemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Template.
     * @param {TemplateDeleteArgs} args - Arguments to delete one Template.
     * @example
     * // Delete one Template
     * const Template = await prisma.template.delete({
     *   where: {
     *     // ... filter to delete one Template
     *   }
     * })
     * 
     */
    delete<T extends TemplateDeleteArgs>(args: SelectSubset<T, TemplateDeleteArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Template.
     * @param {TemplateUpdateArgs} args - Arguments to update one Template.
     * @example
     * // Update one Template
     * const template = await prisma.template.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemplateUpdateArgs>(args: SelectSubset<T, TemplateUpdateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Templates.
     * @param {TemplateDeleteManyArgs} args - Arguments to filter Templates to delete.
     * @example
     * // Delete a few Templates
     * const { count } = await prisma.template.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemplateDeleteManyArgs>(args?: SelectSubset<T, TemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemplateUpdateManyArgs>(args: SelectSubset<T, TemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates and returns the data updated in the database.
     * @param {TemplateUpdateManyAndReturnArgs} args - Arguments to update many Templates.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, TemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Template.
     * @param {TemplateUpsertArgs} args - Arguments to update or create a Template.
     * @example
     * // Update or create a Template
     * const template = await prisma.template.upsert({
     *   create: {
     *     // ... data to create a Template
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Template we want to update
     *   }
     * })
     */
    upsert<T extends TemplateUpsertArgs>(args: SelectSubset<T, TemplateUpsertArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateCountArgs} args - Arguments to filter Templates to count.
     * @example
     * // Count the number of Templates
     * const count = await prisma.template.count({
     *   where: {
     *     // ... the filter for the Templates we want to count
     *   }
     * })
    **/
    count<T extends TemplateCountArgs>(
      args?: Subset<T, TemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemplateAggregateArgs>(args: Subset<T, TemplateAggregateArgs>): Prisma.PrismaPromise<GetTemplateAggregateType<T>>

    /**
     * Group by Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemplateGroupByArgs['orderBy'] }
        : { orderBy?: TemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Template model
   */
  readonly fields: TemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Template.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Template model
   */
  interface TemplateFieldRefs {
    readonly id: FieldRef<"Template", 'String'>
    readonly tenantId: FieldRef<"Template", 'String'>
    readonly name: FieldRef<"Template", 'String'>
    readonly subject: FieldRef<"Template", 'String'>
    readonly html: FieldRef<"Template", 'String'>
    readonly text: FieldRef<"Template", 'String'>
    readonly status: FieldRef<"Template", 'TemplateStatus'>
    readonly createdAt: FieldRef<"Template", 'DateTime'>
    readonly updatedAt: FieldRef<"Template", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Template findUnique
   */
  export type TemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findUniqueOrThrow
   */
  export type TemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findFirst
   */
  export type TemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findFirstOrThrow
   */
  export type TemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findMany
   */
  export type TemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Templates to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template create
   */
  export type TemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a Template.
     */
    data: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
  }

  /**
   * Template createMany
   */
  export type TemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template createManyAndReturn
   */
  export type TemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Template update
   */
  export type TemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a Template.
     */
    data: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
    /**
     * Choose, which Template to update.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template updateMany
   */
  export type TemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to update.
     */
    limit?: number
  }

  /**
   * Template updateManyAndReturn
   */
  export type TemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Template upsert
   */
  export type TemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the Template to update in case it exists.
     */
    where: TemplateWhereUniqueInput
    /**
     * In case the Template found by the `where` argument doesn't exist, create a new Template with this data.
     */
    create: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
    /**
     * In case the Template was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
  }

  /**
   * Template delete
   */
  export type TemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter which Template to delete.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template deleteMany
   */
  export type TemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Templates to delete
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to delete.
     */
    limit?: number
  }

  /**
   * Template without action
   */
  export type TemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    actorType: $Enums.ActorType | null
    actorId: string | null
    action: string | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    actorType: $Enums.ActorType | null
    actorId: string | null
    action: string | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    tenantId: number
    actorType: number
    actorId: number
    action: number
    metadata: number
    ip: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    tenantId?: true
    actorType?: true
    actorId?: true
    action?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    tenantId?: true
    actorType?: true
    actorId?: true
    action?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    tenantId?: true
    actorType?: true
    actorId?: true
    action?: true
    metadata?: true
    ip?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    tenantId: string
    actorType: $Enums.ActorType
    actorId: string
    action: string
    metadata: JsonValue | null
    ip: string | null
    userAgent: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    actorType?: boolean
    actorId?: boolean
    action?: boolean
    metadata?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    actorType?: boolean
    actorId?: boolean
    action?: boolean
    metadata?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    actorType?: boolean
    actorId?: boolean
    action?: boolean
    metadata?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    tenantId?: boolean
    actorType?: boolean
    actorId?: boolean
    action?: boolean
    metadata?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "actorType" | "actorId" | "action" | "metadata" | "ip" | "userAgent" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      actorType: $Enums.ActorType
      actorId: string
      action: string
      metadata: Prisma.JsonValue | null
      ip: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly tenantId: FieldRef<"AuditLog", 'String'>
    readonly actorType: FieldRef<"AuditLog", 'ActorType'>
    readonly actorId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly ip: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    plan: 'plan',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    dailySentCount: 'dailySentCount',
    dailyCountResetAt: 'dailyCountResetAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    mfaEnabled: 'mfaEnabled',
    mfaSecretEnc: 'mfaSecretEnc',
    mfaSecretIv: 'mfaSecretIv',
    mfaSecretTag: 'mfaSecretTag',
    lastLogin: 'lastLogin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SmtpAccountScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    label: 'label',
    gmailAddress: 'gmailAddress',
    encryptedAppPassword: 'encryptedAppPassword',
    iv: 'iv',
    authTag: 'authTag',
    keyVersion: 'keyVersion',
    status: 'status',
    perMinuteLimit: 'perMinuteLimit',
    perDayLimit: 'perDayLimit',
    sentTodayCount: 'sentTodayCount',
    sentTodayResetAt: 'sentTodayResetAt',
    lastSuccessAt: 'lastSuccessAt',
    lastErrorAt: 'lastErrorAt',
    errorStreak: 'errorStreak',
    healthScore: 'healthScore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SmtpAccountScalarFieldEnum = (typeof SmtpAccountScalarFieldEnum)[keyof typeof SmtpAccountScalarFieldEnum]


  export const ApiKeyScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    keyHash: 'keyHash',
    prefix: 'prefix',
    status: 'status',
    createdAt: 'createdAt',
    revokedAt: 'revokedAt',
    rateLimitPerMinute: 'rateLimitPerMinute',
    allowedIps: 'allowedIps'
  };

  export type ApiKeyScalarFieldEnum = (typeof ApiKeyScalarFieldEnum)[keyof typeof ApiKeyScalarFieldEnum]


  export const ApiKeyPermissionScalarFieldEnum: {
    apiKeyId: 'apiKeyId',
    smtpAccountId: 'smtpAccountId'
  };

  export type ApiKeyPermissionScalarFieldEnum = (typeof ApiKeyPermissionScalarFieldEnum)[keyof typeof ApiKeyPermissionScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    apiKeyId: 'apiKeyId',
    smtpAccountId: 'smtpAccountId',
    idempotencyKey: 'idempotencyKey',
    to: 'to',
    cc: 'cc',
    bcc: 'bcc',
    subject: 'subject',
    text: 'text',
    html: 'html',
    fromName: 'fromName',
    replyTo: 'replyTo',
    headers: 'headers',
    status: 'status',
    attempts: 'attempts',
    lastError: 'lastError',
    createdAt: 'createdAt',
    queuedAt: 'queuedAt',
    sentAt: 'sentAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const TemplateScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    subject: 'subject',
    html: 'html',
    text: 'text',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TemplateScalarFieldEnum = (typeof TemplateScalarFieldEnum)[keyof typeof TemplateScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    actorType: 'actorType',
    actorId: 'actorId',
    action: 'action',
    metadata: 'metadata',
    ip: 'ip',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'TenantStatus'
   */
  export type EnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus'>
    


  /**
   * Reference to a field of type 'TenantStatus[]'
   */
  export type ListEnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'SenderStatus'
   */
  export type EnumSenderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SenderStatus'>
    


  /**
   * Reference to a field of type 'SenderStatus[]'
   */
  export type ListEnumSenderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SenderStatus[]'>
    


  /**
   * Reference to a field of type 'ApiKeyStatus'
   */
  export type EnumApiKeyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApiKeyStatus'>
    


  /**
   * Reference to a field of type 'ApiKeyStatus[]'
   */
  export type ListEnumApiKeyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApiKeyStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'MessageStatus'
   */
  export type EnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus'>
    


  /**
   * Reference to a field of type 'MessageStatus[]'
   */
  export type ListEnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus[]'>
    


  /**
   * Reference to a field of type 'TemplateStatus'
   */
  export type EnumTemplateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TemplateStatus'>
    


  /**
   * Reference to a field of type 'TemplateStatus[]'
   */
  export type ListEnumTemplateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TemplateStatus[]'>
    


  /**
   * Reference to a field of type 'ActorType'
   */
  export type EnumActorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActorType'>
    


  /**
   * Reference to a field of type 'ActorType[]'
   */
  export type ListEnumActorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActorType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    plan?: StringFilter<"Tenant"> | string
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    dailySentCount?: IntFilter<"Tenant"> | number
    dailyCountResetAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    users?: UserListRelationFilter
    smtpAccounts?: SmtpAccountListRelationFilter
    apiKeys?: ApiKeyListRelationFilter
    templates?: TemplateListRelationFilter
    messages?: MessageListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dailySentCount?: SortOrder
    dailyCountResetAt?: SortOrderInput | SortOrder
    users?: UserOrderByRelationAggregateInput
    smtpAccounts?: SmtpAccountOrderByRelationAggregateInput
    apiKeys?: ApiKeyOrderByRelationAggregateInput
    templates?: TemplateOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    plan?: StringFilter<"Tenant"> | string
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    dailySentCount?: IntFilter<"Tenant"> | number
    dailyCountResetAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    users?: UserListRelationFilter
    smtpAccounts?: SmtpAccountListRelationFilter
    apiKeys?: ApiKeyListRelationFilter
    templates?: TemplateListRelationFilter
    messages?: MessageListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dailySentCount?: SortOrder
    dailyCountResetAt?: SortOrderInput | SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    name?: StringWithAggregatesFilter<"Tenant"> | string
    plan?: StringWithAggregatesFilter<"Tenant"> | string
    status?: EnumTenantStatusWithAggregatesFilter<"Tenant"> | $Enums.TenantStatus
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    dailySentCount?: IntWithAggregatesFilter<"Tenant"> | number
    dailyCountResetAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    tenantId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    mfaEnabled?: BoolFilter<"User"> | boolean
    mfaSecretEnc?: StringNullableFilter<"User"> | string | null
    mfaSecretIv?: StringNullableFilter<"User"> | string | null
    mfaSecretTag?: StringNullableFilter<"User"> | string | null
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrderInput | SortOrder
    mfaSecretIv?: SortOrderInput | SortOrder
    mfaSecretTag?: SortOrderInput | SortOrder
    lastLogin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_email?: UserTenantIdEmailCompoundUniqueInput
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    tenantId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    mfaEnabled?: BoolFilter<"User"> | boolean
    mfaSecretEnc?: StringNullableFilter<"User"> | string | null
    mfaSecretIv?: StringNullableFilter<"User"> | string | null
    mfaSecretTag?: StringNullableFilter<"User"> | string | null
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "tenantId_email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrderInput | SortOrder
    mfaSecretIv?: SortOrderInput | SortOrder
    mfaSecretTag?: SortOrderInput | SortOrder
    lastLogin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    tenantId?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    mfaEnabled?: BoolWithAggregatesFilter<"User"> | boolean
    mfaSecretEnc?: StringNullableWithAggregatesFilter<"User"> | string | null
    mfaSecretIv?: StringNullableWithAggregatesFilter<"User"> | string | null
    mfaSecretTag?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastLogin?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SmtpAccountWhereInput = {
    AND?: SmtpAccountWhereInput | SmtpAccountWhereInput[]
    OR?: SmtpAccountWhereInput[]
    NOT?: SmtpAccountWhereInput | SmtpAccountWhereInput[]
    id?: StringFilter<"SmtpAccount"> | string
    tenantId?: StringFilter<"SmtpAccount"> | string
    label?: StringFilter<"SmtpAccount"> | string
    gmailAddress?: StringFilter<"SmtpAccount"> | string
    encryptedAppPassword?: StringFilter<"SmtpAccount"> | string
    iv?: StringFilter<"SmtpAccount"> | string
    authTag?: StringFilter<"SmtpAccount"> | string
    keyVersion?: StringFilter<"SmtpAccount"> | string
    status?: EnumSenderStatusFilter<"SmtpAccount"> | $Enums.SenderStatus
    perMinuteLimit?: IntFilter<"SmtpAccount"> | number
    perDayLimit?: IntFilter<"SmtpAccount"> | number
    sentTodayCount?: IntFilter<"SmtpAccount"> | number
    sentTodayResetAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    lastSuccessAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    lastErrorAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    errorStreak?: IntFilter<"SmtpAccount"> | number
    healthScore?: IntFilter<"SmtpAccount"> | number
    createdAt?: DateTimeFilter<"SmtpAccount"> | Date | string
    updatedAt?: DateTimeFilter<"SmtpAccount"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    permissions?: ApiKeyPermissionListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type SmtpAccountOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    label?: SortOrder
    gmailAddress?: SortOrder
    encryptedAppPassword?: SortOrder
    iv?: SortOrder
    authTag?: SortOrder
    keyVersion?: SortOrder
    status?: SortOrder
    perMinuteLimit?: SortOrder
    perDayLimit?: SortOrder
    sentTodayCount?: SortOrder
    sentTodayResetAt?: SortOrderInput | SortOrder
    lastSuccessAt?: SortOrderInput | SortOrder
    lastErrorAt?: SortOrderInput | SortOrder
    errorStreak?: SortOrder
    healthScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    permissions?: ApiKeyPermissionOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type SmtpAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_gmailAddress?: SmtpAccountTenantIdGmailAddressCompoundUniqueInput
    AND?: SmtpAccountWhereInput | SmtpAccountWhereInput[]
    OR?: SmtpAccountWhereInput[]
    NOT?: SmtpAccountWhereInput | SmtpAccountWhereInput[]
    tenantId?: StringFilter<"SmtpAccount"> | string
    label?: StringFilter<"SmtpAccount"> | string
    gmailAddress?: StringFilter<"SmtpAccount"> | string
    encryptedAppPassword?: StringFilter<"SmtpAccount"> | string
    iv?: StringFilter<"SmtpAccount"> | string
    authTag?: StringFilter<"SmtpAccount"> | string
    keyVersion?: StringFilter<"SmtpAccount"> | string
    status?: EnumSenderStatusFilter<"SmtpAccount"> | $Enums.SenderStatus
    perMinuteLimit?: IntFilter<"SmtpAccount"> | number
    perDayLimit?: IntFilter<"SmtpAccount"> | number
    sentTodayCount?: IntFilter<"SmtpAccount"> | number
    sentTodayResetAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    lastSuccessAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    lastErrorAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    errorStreak?: IntFilter<"SmtpAccount"> | number
    healthScore?: IntFilter<"SmtpAccount"> | number
    createdAt?: DateTimeFilter<"SmtpAccount"> | Date | string
    updatedAt?: DateTimeFilter<"SmtpAccount"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    permissions?: ApiKeyPermissionListRelationFilter
    messages?: MessageListRelationFilter
  }, "id" | "tenantId_gmailAddress">

  export type SmtpAccountOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    label?: SortOrder
    gmailAddress?: SortOrder
    encryptedAppPassword?: SortOrder
    iv?: SortOrder
    authTag?: SortOrder
    keyVersion?: SortOrder
    status?: SortOrder
    perMinuteLimit?: SortOrder
    perDayLimit?: SortOrder
    sentTodayCount?: SortOrder
    sentTodayResetAt?: SortOrderInput | SortOrder
    lastSuccessAt?: SortOrderInput | SortOrder
    lastErrorAt?: SortOrderInput | SortOrder
    errorStreak?: SortOrder
    healthScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SmtpAccountCountOrderByAggregateInput
    _avg?: SmtpAccountAvgOrderByAggregateInput
    _max?: SmtpAccountMaxOrderByAggregateInput
    _min?: SmtpAccountMinOrderByAggregateInput
    _sum?: SmtpAccountSumOrderByAggregateInput
  }

  export type SmtpAccountScalarWhereWithAggregatesInput = {
    AND?: SmtpAccountScalarWhereWithAggregatesInput | SmtpAccountScalarWhereWithAggregatesInput[]
    OR?: SmtpAccountScalarWhereWithAggregatesInput[]
    NOT?: SmtpAccountScalarWhereWithAggregatesInput | SmtpAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SmtpAccount"> | string
    tenantId?: StringWithAggregatesFilter<"SmtpAccount"> | string
    label?: StringWithAggregatesFilter<"SmtpAccount"> | string
    gmailAddress?: StringWithAggregatesFilter<"SmtpAccount"> | string
    encryptedAppPassword?: StringWithAggregatesFilter<"SmtpAccount"> | string
    iv?: StringWithAggregatesFilter<"SmtpAccount"> | string
    authTag?: StringWithAggregatesFilter<"SmtpAccount"> | string
    keyVersion?: StringWithAggregatesFilter<"SmtpAccount"> | string
    status?: EnumSenderStatusWithAggregatesFilter<"SmtpAccount"> | $Enums.SenderStatus
    perMinuteLimit?: IntWithAggregatesFilter<"SmtpAccount"> | number
    perDayLimit?: IntWithAggregatesFilter<"SmtpAccount"> | number
    sentTodayCount?: IntWithAggregatesFilter<"SmtpAccount"> | number
    sentTodayResetAt?: DateTimeNullableWithAggregatesFilter<"SmtpAccount"> | Date | string | null
    lastSuccessAt?: DateTimeNullableWithAggregatesFilter<"SmtpAccount"> | Date | string | null
    lastErrorAt?: DateTimeNullableWithAggregatesFilter<"SmtpAccount"> | Date | string | null
    errorStreak?: IntWithAggregatesFilter<"SmtpAccount"> | number
    healthScore?: IntWithAggregatesFilter<"SmtpAccount"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SmtpAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SmtpAccount"> | Date | string
  }

  export type ApiKeyWhereInput = {
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    tenantId?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    keyHash?: StringFilter<"ApiKey"> | string
    prefix?: StringFilter<"ApiKey"> | string
    status?: EnumApiKeyStatusFilter<"ApiKey"> | $Enums.ApiKeyStatus
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    revokedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    rateLimitPerMinute?: IntFilter<"ApiKey"> | number
    allowedIps?: JsonNullableFilter<"ApiKey">
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    permissions?: ApiKeyPermissionListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type ApiKeyOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    keyHash?: SortOrder
    prefix?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    rateLimitPerMinute?: SortOrder
    allowedIps?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    permissions?: ApiKeyPermissionOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ApiKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    tenantId?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    keyHash?: StringFilter<"ApiKey"> | string
    prefix?: StringFilter<"ApiKey"> | string
    status?: EnumApiKeyStatusFilter<"ApiKey"> | $Enums.ApiKeyStatus
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    revokedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    rateLimitPerMinute?: IntFilter<"ApiKey"> | number
    allowedIps?: JsonNullableFilter<"ApiKey">
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    permissions?: ApiKeyPermissionListRelationFilter
    messages?: MessageListRelationFilter
  }, "id">

  export type ApiKeyOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    keyHash?: SortOrder
    prefix?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    rateLimitPerMinute?: SortOrder
    allowedIps?: SortOrderInput | SortOrder
    _count?: ApiKeyCountOrderByAggregateInput
    _avg?: ApiKeyAvgOrderByAggregateInput
    _max?: ApiKeyMaxOrderByAggregateInput
    _min?: ApiKeyMinOrderByAggregateInput
    _sum?: ApiKeySumOrderByAggregateInput
  }

  export type ApiKeyScalarWhereWithAggregatesInput = {
    AND?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    OR?: ApiKeyScalarWhereWithAggregatesInput[]
    NOT?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ApiKey"> | string
    tenantId?: StringWithAggregatesFilter<"ApiKey"> | string
    name?: StringWithAggregatesFilter<"ApiKey"> | string
    keyHash?: StringWithAggregatesFilter<"ApiKey"> | string
    prefix?: StringWithAggregatesFilter<"ApiKey"> | string
    status?: EnumApiKeyStatusWithAggregatesFilter<"ApiKey"> | $Enums.ApiKeyStatus
    createdAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null
    rateLimitPerMinute?: IntWithAggregatesFilter<"ApiKey"> | number
    allowedIps?: JsonNullableWithAggregatesFilter<"ApiKey">
  }

  export type ApiKeyPermissionWhereInput = {
    AND?: ApiKeyPermissionWhereInput | ApiKeyPermissionWhereInput[]
    OR?: ApiKeyPermissionWhereInput[]
    NOT?: ApiKeyPermissionWhereInput | ApiKeyPermissionWhereInput[]
    apiKeyId?: StringFilter<"ApiKeyPermission"> | string
    smtpAccountId?: StringFilter<"ApiKeyPermission"> | string
    apiKey?: XOR<ApiKeyScalarRelationFilter, ApiKeyWhereInput>
    smtpAccount?: XOR<SmtpAccountScalarRelationFilter, SmtpAccountWhereInput>
  }

  export type ApiKeyPermissionOrderByWithRelationInput = {
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
    apiKey?: ApiKeyOrderByWithRelationInput
    smtpAccount?: SmtpAccountOrderByWithRelationInput
  }

  export type ApiKeyPermissionWhereUniqueInput = Prisma.AtLeast<{
    apiKeyId_smtpAccountId?: ApiKeyPermissionApiKeyIdSmtpAccountIdCompoundUniqueInput
    AND?: ApiKeyPermissionWhereInput | ApiKeyPermissionWhereInput[]
    OR?: ApiKeyPermissionWhereInput[]
    NOT?: ApiKeyPermissionWhereInput | ApiKeyPermissionWhereInput[]
    apiKeyId?: StringFilter<"ApiKeyPermission"> | string
    smtpAccountId?: StringFilter<"ApiKeyPermission"> | string
    apiKey?: XOR<ApiKeyScalarRelationFilter, ApiKeyWhereInput>
    smtpAccount?: XOR<SmtpAccountScalarRelationFilter, SmtpAccountWhereInput>
  }, "apiKeyId_smtpAccountId">

  export type ApiKeyPermissionOrderByWithAggregationInput = {
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
    _count?: ApiKeyPermissionCountOrderByAggregateInput
    _max?: ApiKeyPermissionMaxOrderByAggregateInput
    _min?: ApiKeyPermissionMinOrderByAggregateInput
  }

  export type ApiKeyPermissionScalarWhereWithAggregatesInput = {
    AND?: ApiKeyPermissionScalarWhereWithAggregatesInput | ApiKeyPermissionScalarWhereWithAggregatesInput[]
    OR?: ApiKeyPermissionScalarWhereWithAggregatesInput[]
    NOT?: ApiKeyPermissionScalarWhereWithAggregatesInput | ApiKeyPermissionScalarWhereWithAggregatesInput[]
    apiKeyId?: StringWithAggregatesFilter<"ApiKeyPermission"> | string
    smtpAccountId?: StringWithAggregatesFilter<"ApiKeyPermission"> | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    tenantId?: StringFilter<"Message"> | string
    apiKeyId?: StringFilter<"Message"> | string
    smtpAccountId?: StringFilter<"Message"> | string
    idempotencyKey?: StringFilter<"Message"> | string
    to?: JsonFilter<"Message">
    cc?: JsonFilter<"Message">
    bcc?: JsonFilter<"Message">
    subject?: StringFilter<"Message"> | string
    text?: StringNullableFilter<"Message"> | string | null
    html?: StringNullableFilter<"Message"> | string | null
    fromName?: StringNullableFilter<"Message"> | string | null
    replyTo?: StringNullableFilter<"Message"> | string | null
    headers?: JsonNullableFilter<"Message">
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    attempts?: IntFilter<"Message"> | number
    lastError?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    queuedAt?: DateTimeFilter<"Message"> | Date | string
    sentAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    apiKey?: XOR<ApiKeyScalarRelationFilter, ApiKeyWhereInput>
    smtpAccount?: XOR<SmtpAccountScalarRelationFilter, SmtpAccountWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
    idempotencyKey?: SortOrder
    to?: SortOrder
    cc?: SortOrder
    bcc?: SortOrder
    subject?: SortOrder
    text?: SortOrderInput | SortOrder
    html?: SortOrderInput | SortOrder
    fromName?: SortOrderInput | SortOrder
    replyTo?: SortOrderInput | SortOrder
    headers?: SortOrderInput | SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    queuedAt?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    apiKey?: ApiKeyOrderByWithRelationInput
    smtpAccount?: SmtpAccountOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    apiKeyId_idempotencyKey?: MessageApiKeyIdIdempotencyKeyCompoundUniqueInput
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    tenantId?: StringFilter<"Message"> | string
    apiKeyId?: StringFilter<"Message"> | string
    smtpAccountId?: StringFilter<"Message"> | string
    idempotencyKey?: StringFilter<"Message"> | string
    to?: JsonFilter<"Message">
    cc?: JsonFilter<"Message">
    bcc?: JsonFilter<"Message">
    subject?: StringFilter<"Message"> | string
    text?: StringNullableFilter<"Message"> | string | null
    html?: StringNullableFilter<"Message"> | string | null
    fromName?: StringNullableFilter<"Message"> | string | null
    replyTo?: StringNullableFilter<"Message"> | string | null
    headers?: JsonNullableFilter<"Message">
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    attempts?: IntFilter<"Message"> | number
    lastError?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    queuedAt?: DateTimeFilter<"Message"> | Date | string
    sentAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    apiKey?: XOR<ApiKeyScalarRelationFilter, ApiKeyWhereInput>
    smtpAccount?: XOR<SmtpAccountScalarRelationFilter, SmtpAccountWhereInput>
  }, "id" | "apiKeyId_idempotencyKey">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
    idempotencyKey?: SortOrder
    to?: SortOrder
    cc?: SortOrder
    bcc?: SortOrder
    subject?: SortOrder
    text?: SortOrderInput | SortOrder
    html?: SortOrderInput | SortOrder
    fromName?: SortOrderInput | SortOrder
    replyTo?: SortOrderInput | SortOrder
    headers?: SortOrderInput | SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    queuedAt?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    _count?: MessageCountOrderByAggregateInput
    _avg?: MessageAvgOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
    _sum?: MessageSumOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    tenantId?: StringWithAggregatesFilter<"Message"> | string
    apiKeyId?: StringWithAggregatesFilter<"Message"> | string
    smtpAccountId?: StringWithAggregatesFilter<"Message"> | string
    idempotencyKey?: StringWithAggregatesFilter<"Message"> | string
    to?: JsonWithAggregatesFilter<"Message">
    cc?: JsonWithAggregatesFilter<"Message">
    bcc?: JsonWithAggregatesFilter<"Message">
    subject?: StringWithAggregatesFilter<"Message"> | string
    text?: StringNullableWithAggregatesFilter<"Message"> | string | null
    html?: StringNullableWithAggregatesFilter<"Message"> | string | null
    fromName?: StringNullableWithAggregatesFilter<"Message"> | string | null
    replyTo?: StringNullableWithAggregatesFilter<"Message"> | string | null
    headers?: JsonNullableWithAggregatesFilter<"Message">
    status?: EnumMessageStatusWithAggregatesFilter<"Message"> | $Enums.MessageStatus
    attempts?: IntWithAggregatesFilter<"Message"> | number
    lastError?: StringNullableWithAggregatesFilter<"Message"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    queuedAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    sentAt?: DateTimeNullableWithAggregatesFilter<"Message"> | Date | string | null
  }

  export type TemplateWhereInput = {
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    id?: StringFilter<"Template"> | string
    tenantId?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    subject?: StringFilter<"Template"> | string
    html?: StringFilter<"Template"> | string
    text?: StringNullableFilter<"Template"> | string | null
    status?: EnumTemplateStatusFilter<"Template"> | $Enums.TemplateStatus
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type TemplateOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    subject?: SortOrder
    html?: SortOrder
    text?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type TemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_name?: TemplateTenantIdNameCompoundUniqueInput
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    tenantId?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    subject?: StringFilter<"Template"> | string
    html?: StringFilter<"Template"> | string
    text?: StringNullableFilter<"Template"> | string | null
    status?: EnumTemplateStatusFilter<"Template"> | $Enums.TemplateStatus
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "tenantId_name">

  export type TemplateOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    subject?: SortOrder
    html?: SortOrder
    text?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TemplateCountOrderByAggregateInput
    _max?: TemplateMaxOrderByAggregateInput
    _min?: TemplateMinOrderByAggregateInput
  }

  export type TemplateScalarWhereWithAggregatesInput = {
    AND?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    OR?: TemplateScalarWhereWithAggregatesInput[]
    NOT?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Template"> | string
    tenantId?: StringWithAggregatesFilter<"Template"> | string
    name?: StringWithAggregatesFilter<"Template"> | string
    subject?: StringWithAggregatesFilter<"Template"> | string
    html?: StringWithAggregatesFilter<"Template"> | string
    text?: StringNullableWithAggregatesFilter<"Template"> | string | null
    status?: EnumTemplateStatusWithAggregatesFilter<"Template"> | $Enums.TemplateStatus
    createdAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    tenantId?: StringFilter<"AuditLog"> | string
    actorType?: EnumActorTypeFilter<"AuditLog"> | $Enums.ActorType
    actorId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    metadata?: JsonNullableFilter<"AuditLog">
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    metadata?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    tenantId?: StringFilter<"AuditLog"> | string
    actorType?: EnumActorTypeFilter<"AuditLog"> | $Enums.ActorType
    actorId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    metadata?: JsonNullableFilter<"AuditLog">
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    metadata?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    tenantId?: StringWithAggregatesFilter<"AuditLog"> | string
    actorType?: EnumActorTypeWithAggregatesFilter<"AuditLog"> | $Enums.ActorType
    actorId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
    ip?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyCreateNestedManyWithoutTenantInput
    templates?: TemplateCreateNestedManyWithoutTenantInput
    messages?: MessageCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountUncheckedCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutTenantInput
    templates?: TemplateUncheckedCreateNestedManyWithoutTenantInput
    messages?: MessageUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutTenantNestedInput
    templates?: TemplateUpdateManyWithoutTenantNestedInput
    messages?: MessageUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUncheckedUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutTenantNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutTenantNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    lastLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    tenantId: string
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    lastLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    tenantId: string
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    lastLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmtpAccountCreateInput = {
    id?: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSmtpAccountsInput
    permissions?: ApiKeyPermissionCreateNestedManyWithoutSmtpAccountInput
    messages?: MessageCreateNestedManyWithoutSmtpAccountInput
  }

  export type SmtpAccountUncheckedCreateInput = {
    id?: string
    tenantId: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    permissions?: ApiKeyPermissionUncheckedCreateNestedManyWithoutSmtpAccountInput
    messages?: MessageUncheckedCreateNestedManyWithoutSmtpAccountInput
  }

  export type SmtpAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSmtpAccountsNestedInput
    permissions?: ApiKeyPermissionUpdateManyWithoutSmtpAccountNestedInput
    messages?: MessageUpdateManyWithoutSmtpAccountNestedInput
  }

  export type SmtpAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissions?: ApiKeyPermissionUncheckedUpdateManyWithoutSmtpAccountNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSmtpAccountNestedInput
  }

  export type SmtpAccountCreateManyInput = {
    id?: string
    tenantId: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SmtpAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmtpAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateInput = {
    id?: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    tenant: TenantCreateNestedOneWithoutApiKeysInput
    permissions?: ApiKeyPermissionCreateNestedManyWithoutApiKeyInput
    messages?: MessageCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUncheckedCreateInput = {
    id?: string
    tenantId: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    permissions?: ApiKeyPermissionUncheckedCreateNestedManyWithoutApiKeyInput
    messages?: MessageUncheckedCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    tenant?: TenantUpdateOneRequiredWithoutApiKeysNestedInput
    permissions?: ApiKeyPermissionUpdateManyWithoutApiKeyNestedInput
    messages?: MessageUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    permissions?: ApiKeyPermissionUncheckedUpdateManyWithoutApiKeyNestedInput
    messages?: MessageUncheckedUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyCreateManyInput = {
    id?: string
    tenantId: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ApiKeyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ApiKeyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ApiKeyPermissionCreateInput = {
    apiKey: ApiKeyCreateNestedOneWithoutPermissionsInput
    smtpAccount: SmtpAccountCreateNestedOneWithoutPermissionsInput
  }

  export type ApiKeyPermissionUncheckedCreateInput = {
    apiKeyId: string
    smtpAccountId: string
  }

  export type ApiKeyPermissionUpdateInput = {
    apiKey?: ApiKeyUpdateOneRequiredWithoutPermissionsNestedInput
    smtpAccount?: SmtpAccountUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type ApiKeyPermissionUncheckedUpdateInput = {
    apiKeyId?: StringFieldUpdateOperationsInput | string
    smtpAccountId?: StringFieldUpdateOperationsInput | string
  }

  export type ApiKeyPermissionCreateManyInput = {
    apiKeyId: string
    smtpAccountId: string
  }

  export type ApiKeyPermissionUpdateManyMutationInput = {

  }

  export type ApiKeyPermissionUncheckedUpdateManyInput = {
    apiKeyId?: StringFieldUpdateOperationsInput | string
    smtpAccountId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageCreateInput = {
    id?: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutMessagesInput
    apiKey: ApiKeyCreateNestedOneWithoutMessagesInput
    smtpAccount: SmtpAccountCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    tenantId: string
    apiKeyId: string
    smtpAccountId: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutMessagesNestedInput
    apiKey?: ApiKeyUpdateOneRequiredWithoutMessagesNestedInput
    smtpAccount?: SmtpAccountUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    apiKeyId?: StringFieldUpdateOperationsInput | string
    smtpAccountId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageCreateManyInput = {
    id?: string
    tenantId: string
    apiKeyId: string
    smtpAccountId: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    apiKeyId?: StringFieldUpdateOperationsInput | string
    smtpAccountId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TemplateCreateInput = {
    id?: string
    name: string
    subject: string
    html: string
    text?: string | null
    status?: $Enums.TemplateStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutTemplatesInput
  }

  export type TemplateUncheckedCreateInput = {
    id?: string
    tenantId: string
    name: string
    subject: string
    html: string
    text?: string | null
    status?: $Enums.TemplateStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    html?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTemplateStatusFieldUpdateOperationsInput | $Enums.TemplateStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutTemplatesNestedInput
  }

  export type TemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    html?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTemplateStatusFieldUpdateOperationsInput | $Enums.TemplateStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateCreateManyInput = {
    id?: string
    tenantId: string
    name: string
    subject: string
    html: string
    text?: string | null
    status?: $Enums.TemplateStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    html?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTemplateStatusFieldUpdateOperationsInput | $Enums.TemplateStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    html?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTemplateStatusFieldUpdateOperationsInput | $Enums.TemplateStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    actorType: $Enums.ActorType
    actorId: string
    action: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    tenantId: string
    actorType: $Enums.ActorType
    actorId: string
    action: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: EnumActorTypeFieldUpdateOperationsInput | $Enums.ActorType
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    actorType?: EnumActorTypeFieldUpdateOperationsInput | $Enums.ActorType
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    tenantId: string
    actorType: $Enums.ActorType
    actorId: string
    action: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: EnumActorTypeFieldUpdateOperationsInput | $Enums.ActorType
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    actorType?: EnumActorTypeFieldUpdateOperationsInput | $Enums.ActorType
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type SmtpAccountListRelationFilter = {
    every?: SmtpAccountWhereInput
    some?: SmtpAccountWhereInput
    none?: SmtpAccountWhereInput
  }

  export type ApiKeyListRelationFilter = {
    every?: ApiKeyWhereInput
    some?: ApiKeyWhereInput
    none?: ApiKeyWhereInput
  }

  export type TemplateListRelationFilter = {
    every?: TemplateWhereInput
    some?: TemplateWhereInput
    none?: TemplateWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SmtpAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApiKeyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TemplateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dailySentCount?: SortOrder
    dailyCountResetAt?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    dailySentCount?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dailySentCount?: SortOrder
    dailyCountResetAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dailySentCount?: SortOrder
    dailyCountResetAt?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    dailySentCount?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type UserTenantIdEmailCompoundUniqueInput = {
    tenantId: string
    email: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrder
    mfaSecretIv?: SortOrder
    mfaSecretTag?: SortOrder
    lastLogin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrder
    mfaSecretIv?: SortOrder
    mfaSecretTag?: SortOrder
    lastLogin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrder
    mfaSecretIv?: SortOrder
    mfaSecretTag?: SortOrder
    lastLogin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumSenderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SenderStatus | EnumSenderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SenderStatus[] | ListEnumSenderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SenderStatus[] | ListEnumSenderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSenderStatusFilter<$PrismaModel> | $Enums.SenderStatus
  }

  export type ApiKeyPermissionListRelationFilter = {
    every?: ApiKeyPermissionWhereInput
    some?: ApiKeyPermissionWhereInput
    none?: ApiKeyPermissionWhereInput
  }

  export type ApiKeyPermissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SmtpAccountTenantIdGmailAddressCompoundUniqueInput = {
    tenantId: string
    gmailAddress: string
  }

  export type SmtpAccountCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    label?: SortOrder
    gmailAddress?: SortOrder
    encryptedAppPassword?: SortOrder
    iv?: SortOrder
    authTag?: SortOrder
    keyVersion?: SortOrder
    status?: SortOrder
    perMinuteLimit?: SortOrder
    perDayLimit?: SortOrder
    sentTodayCount?: SortOrder
    sentTodayResetAt?: SortOrder
    lastSuccessAt?: SortOrder
    lastErrorAt?: SortOrder
    errorStreak?: SortOrder
    healthScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmtpAccountAvgOrderByAggregateInput = {
    perMinuteLimit?: SortOrder
    perDayLimit?: SortOrder
    sentTodayCount?: SortOrder
    errorStreak?: SortOrder
    healthScore?: SortOrder
  }

  export type SmtpAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    label?: SortOrder
    gmailAddress?: SortOrder
    encryptedAppPassword?: SortOrder
    iv?: SortOrder
    authTag?: SortOrder
    keyVersion?: SortOrder
    status?: SortOrder
    perMinuteLimit?: SortOrder
    perDayLimit?: SortOrder
    sentTodayCount?: SortOrder
    sentTodayResetAt?: SortOrder
    lastSuccessAt?: SortOrder
    lastErrorAt?: SortOrder
    errorStreak?: SortOrder
    healthScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmtpAccountMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    label?: SortOrder
    gmailAddress?: SortOrder
    encryptedAppPassword?: SortOrder
    iv?: SortOrder
    authTag?: SortOrder
    keyVersion?: SortOrder
    status?: SortOrder
    perMinuteLimit?: SortOrder
    perDayLimit?: SortOrder
    sentTodayCount?: SortOrder
    sentTodayResetAt?: SortOrder
    lastSuccessAt?: SortOrder
    lastErrorAt?: SortOrder
    errorStreak?: SortOrder
    healthScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmtpAccountSumOrderByAggregateInput = {
    perMinuteLimit?: SortOrder
    perDayLimit?: SortOrder
    sentTodayCount?: SortOrder
    errorStreak?: SortOrder
    healthScore?: SortOrder
  }

  export type EnumSenderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SenderStatus | EnumSenderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SenderStatus[] | ListEnumSenderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SenderStatus[] | ListEnumSenderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSenderStatusWithAggregatesFilter<$PrismaModel> | $Enums.SenderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSenderStatusFilter<$PrismaModel>
    _max?: NestedEnumSenderStatusFilter<$PrismaModel>
  }

  export type EnumApiKeyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApiKeyStatus | EnumApiKeyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApiKeyStatus[] | ListEnumApiKeyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApiKeyStatus[] | ListEnumApiKeyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApiKeyStatusFilter<$PrismaModel> | $Enums.ApiKeyStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ApiKeyCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    keyHash?: SortOrder
    prefix?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
    rateLimitPerMinute?: SortOrder
    allowedIps?: SortOrder
  }

  export type ApiKeyAvgOrderByAggregateInput = {
    rateLimitPerMinute?: SortOrder
  }

  export type ApiKeyMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    keyHash?: SortOrder
    prefix?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
    rateLimitPerMinute?: SortOrder
  }

  export type ApiKeyMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    keyHash?: SortOrder
    prefix?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
    rateLimitPerMinute?: SortOrder
  }

  export type ApiKeySumOrderByAggregateInput = {
    rateLimitPerMinute?: SortOrder
  }

  export type EnumApiKeyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApiKeyStatus | EnumApiKeyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApiKeyStatus[] | ListEnumApiKeyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApiKeyStatus[] | ListEnumApiKeyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApiKeyStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApiKeyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApiKeyStatusFilter<$PrismaModel>
    _max?: NestedEnumApiKeyStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ApiKeyScalarRelationFilter = {
    is?: ApiKeyWhereInput
    isNot?: ApiKeyWhereInput
  }

  export type SmtpAccountScalarRelationFilter = {
    is?: SmtpAccountWhereInput
    isNot?: SmtpAccountWhereInput
  }

  export type ApiKeyPermissionApiKeyIdSmtpAccountIdCompoundUniqueInput = {
    apiKeyId: string
    smtpAccountId: string
  }

  export type ApiKeyPermissionCountOrderByAggregateInput = {
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
  }

  export type ApiKeyPermissionMaxOrderByAggregateInput = {
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
  }

  export type ApiKeyPermissionMinOrderByAggregateInput = {
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumMessageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusFilter<$PrismaModel> | $Enums.MessageStatus
  }

  export type MessageApiKeyIdIdempotencyKeyCompoundUniqueInput = {
    apiKeyId: string
    idempotencyKey: string
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
    idempotencyKey?: SortOrder
    to?: SortOrder
    cc?: SortOrder
    bcc?: SortOrder
    subject?: SortOrder
    text?: SortOrder
    html?: SortOrder
    fromName?: SortOrder
    replyTo?: SortOrder
    headers?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    queuedAt?: SortOrder
    sentAt?: SortOrder
  }

  export type MessageAvgOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
    idempotencyKey?: SortOrder
    subject?: SortOrder
    text?: SortOrder
    html?: SortOrder
    fromName?: SortOrder
    replyTo?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    queuedAt?: SortOrder
    sentAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    apiKeyId?: SortOrder
    smtpAccountId?: SortOrder
    idempotencyKey?: SortOrder
    subject?: SortOrder
    text?: SortOrder
    html?: SortOrder
    fromName?: SortOrder
    replyTo?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    queuedAt?: SortOrder
    sentAt?: SortOrder
  }

  export type MessageSumOrderByAggregateInput = {
    attempts?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumMessageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatusFilter<$PrismaModel>
    _max?: NestedEnumMessageStatusFilter<$PrismaModel>
  }

  export type EnumTemplateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TemplateStatus | EnumTemplateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TemplateStatus[] | ListEnumTemplateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TemplateStatus[] | ListEnumTemplateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTemplateStatusFilter<$PrismaModel> | $Enums.TemplateStatus
  }

  export type TemplateTenantIdNameCompoundUniqueInput = {
    tenantId: string
    name: string
  }

  export type TemplateCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    subject?: SortOrder
    html?: SortOrder
    text?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    subject?: SortOrder
    html?: SortOrder
    text?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemplateMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    subject?: SortOrder
    html?: SortOrder
    text?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTemplateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TemplateStatus | EnumTemplateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TemplateStatus[] | ListEnumTemplateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TemplateStatus[] | ListEnumTemplateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTemplateStatusWithAggregatesFilter<$PrismaModel> | $Enums.TemplateStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTemplateStatusFilter<$PrismaModel>
    _max?: NestedEnumTemplateStatusFilter<$PrismaModel>
  }

  export type EnumActorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActorType | EnumActorTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActorType[] | ListEnumActorTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActorType[] | ListEnumActorTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActorTypeFilter<$PrismaModel> | $Enums.ActorType
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    metadata?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumActorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActorType | EnumActorTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActorType[] | ListEnumActorTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActorType[] | ListEnumActorTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActorTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActorType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActorTypeFilter<$PrismaModel>
    _max?: NestedEnumActorTypeFilter<$PrismaModel>
  }

  export type UserCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type SmtpAccountCreateNestedManyWithoutTenantInput = {
    create?: XOR<SmtpAccountCreateWithoutTenantInput, SmtpAccountUncheckedCreateWithoutTenantInput> | SmtpAccountCreateWithoutTenantInput[] | SmtpAccountUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SmtpAccountCreateOrConnectWithoutTenantInput | SmtpAccountCreateOrConnectWithoutTenantInput[]
    createMany?: SmtpAccountCreateManyTenantInputEnvelope
    connect?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
  }

  export type ApiKeyCreateNestedManyWithoutTenantInput = {
    create?: XOR<ApiKeyCreateWithoutTenantInput, ApiKeyUncheckedCreateWithoutTenantInput> | ApiKeyCreateWithoutTenantInput[] | ApiKeyUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutTenantInput | ApiKeyCreateOrConnectWithoutTenantInput[]
    createMany?: ApiKeyCreateManyTenantInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type TemplateCreateNestedManyWithoutTenantInput = {
    create?: XOR<TemplateCreateWithoutTenantInput, TemplateUncheckedCreateWithoutTenantInput> | TemplateCreateWithoutTenantInput[] | TemplateUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutTenantInput | TemplateCreateOrConnectWithoutTenantInput[]
    createMany?: TemplateCreateManyTenantInputEnvelope
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutTenantInput = {
    create?: XOR<MessageCreateWithoutTenantInput, MessageUncheckedCreateWithoutTenantInput> | MessageCreateWithoutTenantInput[] | MessageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTenantInput | MessageCreateOrConnectWithoutTenantInput[]
    createMany?: MessageCreateManyTenantInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutTenantInput = {
    create?: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput> | AuditLogCreateWithoutTenantInput[] | AuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutTenantInput | AuditLogCreateOrConnectWithoutTenantInput[]
    createMany?: AuditLogCreateManyTenantInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type SmtpAccountUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<SmtpAccountCreateWithoutTenantInput, SmtpAccountUncheckedCreateWithoutTenantInput> | SmtpAccountCreateWithoutTenantInput[] | SmtpAccountUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SmtpAccountCreateOrConnectWithoutTenantInput | SmtpAccountCreateOrConnectWithoutTenantInput[]
    createMany?: SmtpAccountCreateManyTenantInputEnvelope
    connect?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
  }

  export type ApiKeyUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<ApiKeyCreateWithoutTenantInput, ApiKeyUncheckedCreateWithoutTenantInput> | ApiKeyCreateWithoutTenantInput[] | ApiKeyUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutTenantInput | ApiKeyCreateOrConnectWithoutTenantInput[]
    createMany?: ApiKeyCreateManyTenantInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type TemplateUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TemplateCreateWithoutTenantInput, TemplateUncheckedCreateWithoutTenantInput> | TemplateCreateWithoutTenantInput[] | TemplateUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutTenantInput | TemplateCreateOrConnectWithoutTenantInput[]
    createMany?: TemplateCreateManyTenantInputEnvelope
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<MessageCreateWithoutTenantInput, MessageUncheckedCreateWithoutTenantInput> | MessageCreateWithoutTenantInput[] | MessageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTenantInput | MessageCreateOrConnectWithoutTenantInput[]
    createMany?: MessageCreateManyTenantInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput> | AuditLogCreateWithoutTenantInput[] | AuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutTenantInput | AuditLogCreateOrConnectWithoutTenantInput[]
    createMany?: AuditLogCreateManyTenantInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumTenantStatusFieldUpdateOperationsInput = {
    set?: $Enums.TenantStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type SmtpAccountUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SmtpAccountCreateWithoutTenantInput, SmtpAccountUncheckedCreateWithoutTenantInput> | SmtpAccountCreateWithoutTenantInput[] | SmtpAccountUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SmtpAccountCreateOrConnectWithoutTenantInput | SmtpAccountCreateOrConnectWithoutTenantInput[]
    upsert?: SmtpAccountUpsertWithWhereUniqueWithoutTenantInput | SmtpAccountUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SmtpAccountCreateManyTenantInputEnvelope
    set?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
    disconnect?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
    delete?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
    connect?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
    update?: SmtpAccountUpdateWithWhereUniqueWithoutTenantInput | SmtpAccountUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SmtpAccountUpdateManyWithWhereWithoutTenantInput | SmtpAccountUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SmtpAccountScalarWhereInput | SmtpAccountScalarWhereInput[]
  }

  export type ApiKeyUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ApiKeyCreateWithoutTenantInput, ApiKeyUncheckedCreateWithoutTenantInput> | ApiKeyCreateWithoutTenantInput[] | ApiKeyUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutTenantInput | ApiKeyCreateOrConnectWithoutTenantInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutTenantInput | ApiKeyUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ApiKeyCreateManyTenantInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutTenantInput | ApiKeyUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutTenantInput | ApiKeyUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type TemplateUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TemplateCreateWithoutTenantInput, TemplateUncheckedCreateWithoutTenantInput> | TemplateCreateWithoutTenantInput[] | TemplateUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutTenantInput | TemplateCreateOrConnectWithoutTenantInput[]
    upsert?: TemplateUpsertWithWhereUniqueWithoutTenantInput | TemplateUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TemplateCreateManyTenantInputEnvelope
    set?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    disconnect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    delete?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    update?: TemplateUpdateWithWhereUniqueWithoutTenantInput | TemplateUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TemplateUpdateManyWithWhereWithoutTenantInput | TemplateUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutTenantNestedInput = {
    create?: XOR<MessageCreateWithoutTenantInput, MessageUncheckedCreateWithoutTenantInput> | MessageCreateWithoutTenantInput[] | MessageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTenantInput | MessageCreateOrConnectWithoutTenantInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutTenantInput | MessageUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: MessageCreateManyTenantInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutTenantInput | MessageUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutTenantInput | MessageUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput> | AuditLogCreateWithoutTenantInput[] | AuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutTenantInput | AuditLogCreateOrConnectWithoutTenantInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutTenantInput | AuditLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AuditLogCreateManyTenantInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutTenantInput | AuditLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutTenantInput | AuditLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type SmtpAccountUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SmtpAccountCreateWithoutTenantInput, SmtpAccountUncheckedCreateWithoutTenantInput> | SmtpAccountCreateWithoutTenantInput[] | SmtpAccountUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SmtpAccountCreateOrConnectWithoutTenantInput | SmtpAccountCreateOrConnectWithoutTenantInput[]
    upsert?: SmtpAccountUpsertWithWhereUniqueWithoutTenantInput | SmtpAccountUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SmtpAccountCreateManyTenantInputEnvelope
    set?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
    disconnect?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
    delete?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
    connect?: SmtpAccountWhereUniqueInput | SmtpAccountWhereUniqueInput[]
    update?: SmtpAccountUpdateWithWhereUniqueWithoutTenantInput | SmtpAccountUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SmtpAccountUpdateManyWithWhereWithoutTenantInput | SmtpAccountUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SmtpAccountScalarWhereInput | SmtpAccountScalarWhereInput[]
  }

  export type ApiKeyUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ApiKeyCreateWithoutTenantInput, ApiKeyUncheckedCreateWithoutTenantInput> | ApiKeyCreateWithoutTenantInput[] | ApiKeyUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutTenantInput | ApiKeyCreateOrConnectWithoutTenantInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutTenantInput | ApiKeyUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ApiKeyCreateManyTenantInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutTenantInput | ApiKeyUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutTenantInput | ApiKeyUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type TemplateUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TemplateCreateWithoutTenantInput, TemplateUncheckedCreateWithoutTenantInput> | TemplateCreateWithoutTenantInput[] | TemplateUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutTenantInput | TemplateCreateOrConnectWithoutTenantInput[]
    upsert?: TemplateUpsertWithWhereUniqueWithoutTenantInput | TemplateUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TemplateCreateManyTenantInputEnvelope
    set?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    disconnect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    delete?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    update?: TemplateUpdateWithWhereUniqueWithoutTenantInput | TemplateUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TemplateUpdateManyWithWhereWithoutTenantInput | TemplateUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<MessageCreateWithoutTenantInput, MessageUncheckedCreateWithoutTenantInput> | MessageCreateWithoutTenantInput[] | MessageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTenantInput | MessageCreateOrConnectWithoutTenantInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutTenantInput | MessageUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: MessageCreateManyTenantInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutTenantInput | MessageUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutTenantInput | MessageUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput> | AuditLogCreateWithoutTenantInput[] | AuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutTenantInput | AuditLogCreateOrConnectWithoutTenantInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutTenantInput | AuditLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AuditLogCreateManyTenantInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutTenantInput | AuditLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutTenantInput | AuditLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TenantUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    upsert?: TenantUpsertWithoutUsersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsersInput, TenantUpdateWithoutUsersInput>, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantCreateNestedOneWithoutSmtpAccountsInput = {
    create?: XOR<TenantCreateWithoutSmtpAccountsInput, TenantUncheckedCreateWithoutSmtpAccountsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSmtpAccountsInput
    connect?: TenantWhereUniqueInput
  }

  export type ApiKeyPermissionCreateNestedManyWithoutSmtpAccountInput = {
    create?: XOR<ApiKeyPermissionCreateWithoutSmtpAccountInput, ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput> | ApiKeyPermissionCreateWithoutSmtpAccountInput[] | ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput[]
    connectOrCreate?: ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput | ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput[]
    createMany?: ApiKeyPermissionCreateManySmtpAccountInputEnvelope
    connect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutSmtpAccountInput = {
    create?: XOR<MessageCreateWithoutSmtpAccountInput, MessageUncheckedCreateWithoutSmtpAccountInput> | MessageCreateWithoutSmtpAccountInput[] | MessageUncheckedCreateWithoutSmtpAccountInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSmtpAccountInput | MessageCreateOrConnectWithoutSmtpAccountInput[]
    createMany?: MessageCreateManySmtpAccountInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ApiKeyPermissionUncheckedCreateNestedManyWithoutSmtpAccountInput = {
    create?: XOR<ApiKeyPermissionCreateWithoutSmtpAccountInput, ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput> | ApiKeyPermissionCreateWithoutSmtpAccountInput[] | ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput[]
    connectOrCreate?: ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput | ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput[]
    createMany?: ApiKeyPermissionCreateManySmtpAccountInputEnvelope
    connect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSmtpAccountInput = {
    create?: XOR<MessageCreateWithoutSmtpAccountInput, MessageUncheckedCreateWithoutSmtpAccountInput> | MessageCreateWithoutSmtpAccountInput[] | MessageUncheckedCreateWithoutSmtpAccountInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSmtpAccountInput | MessageCreateOrConnectWithoutSmtpAccountInput[]
    createMany?: MessageCreateManySmtpAccountInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type EnumSenderStatusFieldUpdateOperationsInput = {
    set?: $Enums.SenderStatus
  }

  export type TenantUpdateOneRequiredWithoutSmtpAccountsNestedInput = {
    create?: XOR<TenantCreateWithoutSmtpAccountsInput, TenantUncheckedCreateWithoutSmtpAccountsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSmtpAccountsInput
    upsert?: TenantUpsertWithoutSmtpAccountsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSmtpAccountsInput, TenantUpdateWithoutSmtpAccountsInput>, TenantUncheckedUpdateWithoutSmtpAccountsInput>
  }

  export type ApiKeyPermissionUpdateManyWithoutSmtpAccountNestedInput = {
    create?: XOR<ApiKeyPermissionCreateWithoutSmtpAccountInput, ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput> | ApiKeyPermissionCreateWithoutSmtpAccountInput[] | ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput[]
    connectOrCreate?: ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput | ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput[]
    upsert?: ApiKeyPermissionUpsertWithWhereUniqueWithoutSmtpAccountInput | ApiKeyPermissionUpsertWithWhereUniqueWithoutSmtpAccountInput[]
    createMany?: ApiKeyPermissionCreateManySmtpAccountInputEnvelope
    set?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    disconnect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    delete?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    connect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    update?: ApiKeyPermissionUpdateWithWhereUniqueWithoutSmtpAccountInput | ApiKeyPermissionUpdateWithWhereUniqueWithoutSmtpAccountInput[]
    updateMany?: ApiKeyPermissionUpdateManyWithWhereWithoutSmtpAccountInput | ApiKeyPermissionUpdateManyWithWhereWithoutSmtpAccountInput[]
    deleteMany?: ApiKeyPermissionScalarWhereInput | ApiKeyPermissionScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutSmtpAccountNestedInput = {
    create?: XOR<MessageCreateWithoutSmtpAccountInput, MessageUncheckedCreateWithoutSmtpAccountInput> | MessageCreateWithoutSmtpAccountInput[] | MessageUncheckedCreateWithoutSmtpAccountInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSmtpAccountInput | MessageCreateOrConnectWithoutSmtpAccountInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSmtpAccountInput | MessageUpsertWithWhereUniqueWithoutSmtpAccountInput[]
    createMany?: MessageCreateManySmtpAccountInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSmtpAccountInput | MessageUpdateWithWhereUniqueWithoutSmtpAccountInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSmtpAccountInput | MessageUpdateManyWithWhereWithoutSmtpAccountInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ApiKeyPermissionUncheckedUpdateManyWithoutSmtpAccountNestedInput = {
    create?: XOR<ApiKeyPermissionCreateWithoutSmtpAccountInput, ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput> | ApiKeyPermissionCreateWithoutSmtpAccountInput[] | ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput[]
    connectOrCreate?: ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput | ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput[]
    upsert?: ApiKeyPermissionUpsertWithWhereUniqueWithoutSmtpAccountInput | ApiKeyPermissionUpsertWithWhereUniqueWithoutSmtpAccountInput[]
    createMany?: ApiKeyPermissionCreateManySmtpAccountInputEnvelope
    set?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    disconnect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    delete?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    connect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    update?: ApiKeyPermissionUpdateWithWhereUniqueWithoutSmtpAccountInput | ApiKeyPermissionUpdateWithWhereUniqueWithoutSmtpAccountInput[]
    updateMany?: ApiKeyPermissionUpdateManyWithWhereWithoutSmtpAccountInput | ApiKeyPermissionUpdateManyWithWhereWithoutSmtpAccountInput[]
    deleteMany?: ApiKeyPermissionScalarWhereInput | ApiKeyPermissionScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSmtpAccountNestedInput = {
    create?: XOR<MessageCreateWithoutSmtpAccountInput, MessageUncheckedCreateWithoutSmtpAccountInput> | MessageCreateWithoutSmtpAccountInput[] | MessageUncheckedCreateWithoutSmtpAccountInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSmtpAccountInput | MessageCreateOrConnectWithoutSmtpAccountInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSmtpAccountInput | MessageUpsertWithWhereUniqueWithoutSmtpAccountInput[]
    createMany?: MessageCreateManySmtpAccountInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSmtpAccountInput | MessageUpdateWithWhereUniqueWithoutSmtpAccountInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSmtpAccountInput | MessageUpdateManyWithWhereWithoutSmtpAccountInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutApiKeysInput = {
    create?: XOR<TenantCreateWithoutApiKeysInput, TenantUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: TenantCreateOrConnectWithoutApiKeysInput
    connect?: TenantWhereUniqueInput
  }

  export type ApiKeyPermissionCreateNestedManyWithoutApiKeyInput = {
    create?: XOR<ApiKeyPermissionCreateWithoutApiKeyInput, ApiKeyPermissionUncheckedCreateWithoutApiKeyInput> | ApiKeyPermissionCreateWithoutApiKeyInput[] | ApiKeyPermissionUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: ApiKeyPermissionCreateOrConnectWithoutApiKeyInput | ApiKeyPermissionCreateOrConnectWithoutApiKeyInput[]
    createMany?: ApiKeyPermissionCreateManyApiKeyInputEnvelope
    connect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutApiKeyInput = {
    create?: XOR<MessageCreateWithoutApiKeyInput, MessageUncheckedCreateWithoutApiKeyInput> | MessageCreateWithoutApiKeyInput[] | MessageUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutApiKeyInput | MessageCreateOrConnectWithoutApiKeyInput[]
    createMany?: MessageCreateManyApiKeyInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ApiKeyPermissionUncheckedCreateNestedManyWithoutApiKeyInput = {
    create?: XOR<ApiKeyPermissionCreateWithoutApiKeyInput, ApiKeyPermissionUncheckedCreateWithoutApiKeyInput> | ApiKeyPermissionCreateWithoutApiKeyInput[] | ApiKeyPermissionUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: ApiKeyPermissionCreateOrConnectWithoutApiKeyInput | ApiKeyPermissionCreateOrConnectWithoutApiKeyInput[]
    createMany?: ApiKeyPermissionCreateManyApiKeyInputEnvelope
    connect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutApiKeyInput = {
    create?: XOR<MessageCreateWithoutApiKeyInput, MessageUncheckedCreateWithoutApiKeyInput> | MessageCreateWithoutApiKeyInput[] | MessageUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutApiKeyInput | MessageCreateOrConnectWithoutApiKeyInput[]
    createMany?: MessageCreateManyApiKeyInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type EnumApiKeyStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApiKeyStatus
  }

  export type TenantUpdateOneRequiredWithoutApiKeysNestedInput = {
    create?: XOR<TenantCreateWithoutApiKeysInput, TenantUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: TenantCreateOrConnectWithoutApiKeysInput
    upsert?: TenantUpsertWithoutApiKeysInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutApiKeysInput, TenantUpdateWithoutApiKeysInput>, TenantUncheckedUpdateWithoutApiKeysInput>
  }

  export type ApiKeyPermissionUpdateManyWithoutApiKeyNestedInput = {
    create?: XOR<ApiKeyPermissionCreateWithoutApiKeyInput, ApiKeyPermissionUncheckedCreateWithoutApiKeyInput> | ApiKeyPermissionCreateWithoutApiKeyInput[] | ApiKeyPermissionUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: ApiKeyPermissionCreateOrConnectWithoutApiKeyInput | ApiKeyPermissionCreateOrConnectWithoutApiKeyInput[]
    upsert?: ApiKeyPermissionUpsertWithWhereUniqueWithoutApiKeyInput | ApiKeyPermissionUpsertWithWhereUniqueWithoutApiKeyInput[]
    createMany?: ApiKeyPermissionCreateManyApiKeyInputEnvelope
    set?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    disconnect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    delete?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    connect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    update?: ApiKeyPermissionUpdateWithWhereUniqueWithoutApiKeyInput | ApiKeyPermissionUpdateWithWhereUniqueWithoutApiKeyInput[]
    updateMany?: ApiKeyPermissionUpdateManyWithWhereWithoutApiKeyInput | ApiKeyPermissionUpdateManyWithWhereWithoutApiKeyInput[]
    deleteMany?: ApiKeyPermissionScalarWhereInput | ApiKeyPermissionScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutApiKeyNestedInput = {
    create?: XOR<MessageCreateWithoutApiKeyInput, MessageUncheckedCreateWithoutApiKeyInput> | MessageCreateWithoutApiKeyInput[] | MessageUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutApiKeyInput | MessageCreateOrConnectWithoutApiKeyInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutApiKeyInput | MessageUpsertWithWhereUniqueWithoutApiKeyInput[]
    createMany?: MessageCreateManyApiKeyInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutApiKeyInput | MessageUpdateWithWhereUniqueWithoutApiKeyInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutApiKeyInput | MessageUpdateManyWithWhereWithoutApiKeyInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ApiKeyPermissionUncheckedUpdateManyWithoutApiKeyNestedInput = {
    create?: XOR<ApiKeyPermissionCreateWithoutApiKeyInput, ApiKeyPermissionUncheckedCreateWithoutApiKeyInput> | ApiKeyPermissionCreateWithoutApiKeyInput[] | ApiKeyPermissionUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: ApiKeyPermissionCreateOrConnectWithoutApiKeyInput | ApiKeyPermissionCreateOrConnectWithoutApiKeyInput[]
    upsert?: ApiKeyPermissionUpsertWithWhereUniqueWithoutApiKeyInput | ApiKeyPermissionUpsertWithWhereUniqueWithoutApiKeyInput[]
    createMany?: ApiKeyPermissionCreateManyApiKeyInputEnvelope
    set?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    disconnect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    delete?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    connect?: ApiKeyPermissionWhereUniqueInput | ApiKeyPermissionWhereUniqueInput[]
    update?: ApiKeyPermissionUpdateWithWhereUniqueWithoutApiKeyInput | ApiKeyPermissionUpdateWithWhereUniqueWithoutApiKeyInput[]
    updateMany?: ApiKeyPermissionUpdateManyWithWhereWithoutApiKeyInput | ApiKeyPermissionUpdateManyWithWhereWithoutApiKeyInput[]
    deleteMany?: ApiKeyPermissionScalarWhereInput | ApiKeyPermissionScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutApiKeyNestedInput = {
    create?: XOR<MessageCreateWithoutApiKeyInput, MessageUncheckedCreateWithoutApiKeyInput> | MessageCreateWithoutApiKeyInput[] | MessageUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutApiKeyInput | MessageCreateOrConnectWithoutApiKeyInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutApiKeyInput | MessageUpsertWithWhereUniqueWithoutApiKeyInput[]
    createMany?: MessageCreateManyApiKeyInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutApiKeyInput | MessageUpdateWithWhereUniqueWithoutApiKeyInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutApiKeyInput | MessageUpdateManyWithWhereWithoutApiKeyInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ApiKeyCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<ApiKeyCreateWithoutPermissionsInput, ApiKeyUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: ApiKeyCreateOrConnectWithoutPermissionsInput
    connect?: ApiKeyWhereUniqueInput
  }

  export type SmtpAccountCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<SmtpAccountCreateWithoutPermissionsInput, SmtpAccountUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: SmtpAccountCreateOrConnectWithoutPermissionsInput
    connect?: SmtpAccountWhereUniqueInput
  }

  export type ApiKeyUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<ApiKeyCreateWithoutPermissionsInput, ApiKeyUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: ApiKeyCreateOrConnectWithoutPermissionsInput
    upsert?: ApiKeyUpsertWithoutPermissionsInput
    connect?: ApiKeyWhereUniqueInput
    update?: XOR<XOR<ApiKeyUpdateToOneWithWhereWithoutPermissionsInput, ApiKeyUpdateWithoutPermissionsInput>, ApiKeyUncheckedUpdateWithoutPermissionsInput>
  }

  export type SmtpAccountUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<SmtpAccountCreateWithoutPermissionsInput, SmtpAccountUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: SmtpAccountCreateOrConnectWithoutPermissionsInput
    upsert?: SmtpAccountUpsertWithoutPermissionsInput
    connect?: SmtpAccountWhereUniqueInput
    update?: XOR<XOR<SmtpAccountUpdateToOneWithWhereWithoutPermissionsInput, SmtpAccountUpdateWithoutPermissionsInput>, SmtpAccountUncheckedUpdateWithoutPermissionsInput>
  }

  export type TenantCreateNestedOneWithoutMessagesInput = {
    create?: XOR<TenantCreateWithoutMessagesInput, TenantUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutMessagesInput
    connect?: TenantWhereUniqueInput
  }

  export type ApiKeyCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ApiKeyCreateWithoutMessagesInput, ApiKeyUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ApiKeyCreateOrConnectWithoutMessagesInput
    connect?: ApiKeyWhereUniqueInput
  }

  export type SmtpAccountCreateNestedOneWithoutMessagesInput = {
    create?: XOR<SmtpAccountCreateWithoutMessagesInput, SmtpAccountUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: SmtpAccountCreateOrConnectWithoutMessagesInput
    connect?: SmtpAccountWhereUniqueInput
  }

  export type EnumMessageStatusFieldUpdateOperationsInput = {
    set?: $Enums.MessageStatus
  }

  export type TenantUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<TenantCreateWithoutMessagesInput, TenantUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutMessagesInput
    upsert?: TenantUpsertWithoutMessagesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutMessagesInput, TenantUpdateWithoutMessagesInput>, TenantUncheckedUpdateWithoutMessagesInput>
  }

  export type ApiKeyUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ApiKeyCreateWithoutMessagesInput, ApiKeyUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ApiKeyCreateOrConnectWithoutMessagesInput
    upsert?: ApiKeyUpsertWithoutMessagesInput
    connect?: ApiKeyWhereUniqueInput
    update?: XOR<XOR<ApiKeyUpdateToOneWithWhereWithoutMessagesInput, ApiKeyUpdateWithoutMessagesInput>, ApiKeyUncheckedUpdateWithoutMessagesInput>
  }

  export type SmtpAccountUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<SmtpAccountCreateWithoutMessagesInput, SmtpAccountUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: SmtpAccountCreateOrConnectWithoutMessagesInput
    upsert?: SmtpAccountUpsertWithoutMessagesInput
    connect?: SmtpAccountWhereUniqueInput
    update?: XOR<XOR<SmtpAccountUpdateToOneWithWhereWithoutMessagesInput, SmtpAccountUpdateWithoutMessagesInput>, SmtpAccountUncheckedUpdateWithoutMessagesInput>
  }

  export type TenantCreateNestedOneWithoutTemplatesInput = {
    create?: XOR<TenantCreateWithoutTemplatesInput, TenantUncheckedCreateWithoutTemplatesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutTemplatesInput
    connect?: TenantWhereUniqueInput
  }

  export type EnumTemplateStatusFieldUpdateOperationsInput = {
    set?: $Enums.TemplateStatus
  }

  export type TenantUpdateOneRequiredWithoutTemplatesNestedInput = {
    create?: XOR<TenantCreateWithoutTemplatesInput, TenantUncheckedCreateWithoutTemplatesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutTemplatesInput
    upsert?: TenantUpsertWithoutTemplatesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutTemplatesInput, TenantUpdateWithoutTemplatesInput>, TenantUncheckedUpdateWithoutTemplatesInput>
  }

  export type TenantCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAuditLogsInput
    connect?: TenantWhereUniqueInput
  }

  export type EnumActorTypeFieldUpdateOperationsInput = {
    set?: $Enums.ActorType
  }

  export type TenantUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAuditLogsInput
    upsert?: TenantUpsertWithoutAuditLogsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutAuditLogsInput, TenantUpdateWithoutAuditLogsInput>, TenantUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumSenderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SenderStatus | EnumSenderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SenderStatus[] | ListEnumSenderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SenderStatus[] | ListEnumSenderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSenderStatusFilter<$PrismaModel> | $Enums.SenderStatus
  }

  export type NestedEnumSenderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SenderStatus | EnumSenderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SenderStatus[] | ListEnumSenderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SenderStatus[] | ListEnumSenderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSenderStatusWithAggregatesFilter<$PrismaModel> | $Enums.SenderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSenderStatusFilter<$PrismaModel>
    _max?: NestedEnumSenderStatusFilter<$PrismaModel>
  }

  export type NestedEnumApiKeyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApiKeyStatus | EnumApiKeyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApiKeyStatus[] | ListEnumApiKeyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApiKeyStatus[] | ListEnumApiKeyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApiKeyStatusFilter<$PrismaModel> | $Enums.ApiKeyStatus
  }

  export type NestedEnumApiKeyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApiKeyStatus | EnumApiKeyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApiKeyStatus[] | ListEnumApiKeyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApiKeyStatus[] | ListEnumApiKeyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApiKeyStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApiKeyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApiKeyStatusFilter<$PrismaModel>
    _max?: NestedEnumApiKeyStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumMessageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusFilter<$PrismaModel> | $Enums.MessageStatus
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatusFilter<$PrismaModel>
    _max?: NestedEnumMessageStatusFilter<$PrismaModel>
  }

  export type NestedEnumTemplateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TemplateStatus | EnumTemplateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TemplateStatus[] | ListEnumTemplateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TemplateStatus[] | ListEnumTemplateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTemplateStatusFilter<$PrismaModel> | $Enums.TemplateStatus
  }

  export type NestedEnumTemplateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TemplateStatus | EnumTemplateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TemplateStatus[] | ListEnumTemplateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TemplateStatus[] | ListEnumTemplateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTemplateStatusWithAggregatesFilter<$PrismaModel> | $Enums.TemplateStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTemplateStatusFilter<$PrismaModel>
    _max?: NestedEnumTemplateStatusFilter<$PrismaModel>
  }

  export type NestedEnumActorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActorType | EnumActorTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActorType[] | ListEnumActorTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActorType[] | ListEnumActorTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActorTypeFilter<$PrismaModel> | $Enums.ActorType
  }

  export type NestedEnumActorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActorType | EnumActorTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActorType[] | ListEnumActorTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActorType[] | ListEnumActorTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActorTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActorType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActorTypeFilter<$PrismaModel>
    _max?: NestedEnumActorTypeFilter<$PrismaModel>
  }

  export type UserCreateWithoutTenantInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    lastLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutTenantInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    lastLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutTenantInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserCreateManyTenantInputEnvelope = {
    data: UserCreateManyTenantInput | UserCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type SmtpAccountCreateWithoutTenantInput = {
    id?: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    permissions?: ApiKeyPermissionCreateNestedManyWithoutSmtpAccountInput
    messages?: MessageCreateNestedManyWithoutSmtpAccountInput
  }

  export type SmtpAccountUncheckedCreateWithoutTenantInput = {
    id?: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    permissions?: ApiKeyPermissionUncheckedCreateNestedManyWithoutSmtpAccountInput
    messages?: MessageUncheckedCreateNestedManyWithoutSmtpAccountInput
  }

  export type SmtpAccountCreateOrConnectWithoutTenantInput = {
    where: SmtpAccountWhereUniqueInput
    create: XOR<SmtpAccountCreateWithoutTenantInput, SmtpAccountUncheckedCreateWithoutTenantInput>
  }

  export type SmtpAccountCreateManyTenantInputEnvelope = {
    data: SmtpAccountCreateManyTenantInput | SmtpAccountCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type ApiKeyCreateWithoutTenantInput = {
    id?: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    permissions?: ApiKeyPermissionCreateNestedManyWithoutApiKeyInput
    messages?: MessageCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUncheckedCreateWithoutTenantInput = {
    id?: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    permissions?: ApiKeyPermissionUncheckedCreateNestedManyWithoutApiKeyInput
    messages?: MessageUncheckedCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyCreateOrConnectWithoutTenantInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutTenantInput, ApiKeyUncheckedCreateWithoutTenantInput>
  }

  export type ApiKeyCreateManyTenantInputEnvelope = {
    data: ApiKeyCreateManyTenantInput | ApiKeyCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TemplateCreateWithoutTenantInput = {
    id?: string
    name: string
    subject: string
    html: string
    text?: string | null
    status?: $Enums.TemplateStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUncheckedCreateWithoutTenantInput = {
    id?: string
    name: string
    subject: string
    html: string
    text?: string | null
    status?: $Enums.TemplateStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateCreateOrConnectWithoutTenantInput = {
    where: TemplateWhereUniqueInput
    create: XOR<TemplateCreateWithoutTenantInput, TemplateUncheckedCreateWithoutTenantInput>
  }

  export type TemplateCreateManyTenantInputEnvelope = {
    data: TemplateCreateManyTenantInput | TemplateCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutTenantInput = {
    id?: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
    apiKey: ApiKeyCreateNestedOneWithoutMessagesInput
    smtpAccount: SmtpAccountCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutTenantInput = {
    id?: string
    apiKeyId: string
    smtpAccountId: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
  }

  export type MessageCreateOrConnectWithoutTenantInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutTenantInput, MessageUncheckedCreateWithoutTenantInput>
  }

  export type MessageCreateManyTenantInputEnvelope = {
    data: MessageCreateManyTenantInput | MessageCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutTenantInput = {
    id?: string
    actorType: $Enums.ActorType
    actorId: string
    action: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutTenantInput = {
    id?: string
    actorType: $Enums.ActorType
    actorId: string
    action: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutTenantInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput>
  }

  export type AuditLogCreateManyTenantInputEnvelope = {
    data: AuditLogCreateManyTenantInput | AuditLogCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
  }

  export type UserUpdateManyWithWhereWithoutTenantInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    tenantId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    mfaEnabled?: BoolFilter<"User"> | boolean
    mfaSecretEnc?: StringNullableFilter<"User"> | string | null
    mfaSecretIv?: StringNullableFilter<"User"> | string | null
    mfaSecretTag?: StringNullableFilter<"User"> | string | null
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type SmtpAccountUpsertWithWhereUniqueWithoutTenantInput = {
    where: SmtpAccountWhereUniqueInput
    update: XOR<SmtpAccountUpdateWithoutTenantInput, SmtpAccountUncheckedUpdateWithoutTenantInput>
    create: XOR<SmtpAccountCreateWithoutTenantInput, SmtpAccountUncheckedCreateWithoutTenantInput>
  }

  export type SmtpAccountUpdateWithWhereUniqueWithoutTenantInput = {
    where: SmtpAccountWhereUniqueInput
    data: XOR<SmtpAccountUpdateWithoutTenantInput, SmtpAccountUncheckedUpdateWithoutTenantInput>
  }

  export type SmtpAccountUpdateManyWithWhereWithoutTenantInput = {
    where: SmtpAccountScalarWhereInput
    data: XOR<SmtpAccountUpdateManyMutationInput, SmtpAccountUncheckedUpdateManyWithoutTenantInput>
  }

  export type SmtpAccountScalarWhereInput = {
    AND?: SmtpAccountScalarWhereInput | SmtpAccountScalarWhereInput[]
    OR?: SmtpAccountScalarWhereInput[]
    NOT?: SmtpAccountScalarWhereInput | SmtpAccountScalarWhereInput[]
    id?: StringFilter<"SmtpAccount"> | string
    tenantId?: StringFilter<"SmtpAccount"> | string
    label?: StringFilter<"SmtpAccount"> | string
    gmailAddress?: StringFilter<"SmtpAccount"> | string
    encryptedAppPassword?: StringFilter<"SmtpAccount"> | string
    iv?: StringFilter<"SmtpAccount"> | string
    authTag?: StringFilter<"SmtpAccount"> | string
    keyVersion?: StringFilter<"SmtpAccount"> | string
    status?: EnumSenderStatusFilter<"SmtpAccount"> | $Enums.SenderStatus
    perMinuteLimit?: IntFilter<"SmtpAccount"> | number
    perDayLimit?: IntFilter<"SmtpAccount"> | number
    sentTodayCount?: IntFilter<"SmtpAccount"> | number
    sentTodayResetAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    lastSuccessAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    lastErrorAt?: DateTimeNullableFilter<"SmtpAccount"> | Date | string | null
    errorStreak?: IntFilter<"SmtpAccount"> | number
    healthScore?: IntFilter<"SmtpAccount"> | number
    createdAt?: DateTimeFilter<"SmtpAccount"> | Date | string
    updatedAt?: DateTimeFilter<"SmtpAccount"> | Date | string
  }

  export type ApiKeyUpsertWithWhereUniqueWithoutTenantInput = {
    where: ApiKeyWhereUniqueInput
    update: XOR<ApiKeyUpdateWithoutTenantInput, ApiKeyUncheckedUpdateWithoutTenantInput>
    create: XOR<ApiKeyCreateWithoutTenantInput, ApiKeyUncheckedCreateWithoutTenantInput>
  }

  export type ApiKeyUpdateWithWhereUniqueWithoutTenantInput = {
    where: ApiKeyWhereUniqueInput
    data: XOR<ApiKeyUpdateWithoutTenantInput, ApiKeyUncheckedUpdateWithoutTenantInput>
  }

  export type ApiKeyUpdateManyWithWhereWithoutTenantInput = {
    where: ApiKeyScalarWhereInput
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyWithoutTenantInput>
  }

  export type ApiKeyScalarWhereInput = {
    AND?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    OR?: ApiKeyScalarWhereInput[]
    NOT?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    tenantId?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    keyHash?: StringFilter<"ApiKey"> | string
    prefix?: StringFilter<"ApiKey"> | string
    status?: EnumApiKeyStatusFilter<"ApiKey"> | $Enums.ApiKeyStatus
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    revokedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    rateLimitPerMinute?: IntFilter<"ApiKey"> | number
    allowedIps?: JsonNullableFilter<"ApiKey">
  }

  export type TemplateUpsertWithWhereUniqueWithoutTenantInput = {
    where: TemplateWhereUniqueInput
    update: XOR<TemplateUpdateWithoutTenantInput, TemplateUncheckedUpdateWithoutTenantInput>
    create: XOR<TemplateCreateWithoutTenantInput, TemplateUncheckedCreateWithoutTenantInput>
  }

  export type TemplateUpdateWithWhereUniqueWithoutTenantInput = {
    where: TemplateWhereUniqueInput
    data: XOR<TemplateUpdateWithoutTenantInput, TemplateUncheckedUpdateWithoutTenantInput>
  }

  export type TemplateUpdateManyWithWhereWithoutTenantInput = {
    where: TemplateScalarWhereInput
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyWithoutTenantInput>
  }

  export type TemplateScalarWhereInput = {
    AND?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
    OR?: TemplateScalarWhereInput[]
    NOT?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
    id?: StringFilter<"Template"> | string
    tenantId?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    subject?: StringFilter<"Template"> | string
    html?: StringFilter<"Template"> | string
    text?: StringNullableFilter<"Template"> | string | null
    status?: EnumTemplateStatusFilter<"Template"> | $Enums.TemplateStatus
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
  }

  export type MessageUpsertWithWhereUniqueWithoutTenantInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutTenantInput, MessageUncheckedUpdateWithoutTenantInput>
    create: XOR<MessageCreateWithoutTenantInput, MessageUncheckedCreateWithoutTenantInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutTenantInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutTenantInput, MessageUncheckedUpdateWithoutTenantInput>
  }

  export type MessageUpdateManyWithWhereWithoutTenantInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutTenantInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    tenantId?: StringFilter<"Message"> | string
    apiKeyId?: StringFilter<"Message"> | string
    smtpAccountId?: StringFilter<"Message"> | string
    idempotencyKey?: StringFilter<"Message"> | string
    to?: JsonFilter<"Message">
    cc?: JsonFilter<"Message">
    bcc?: JsonFilter<"Message">
    subject?: StringFilter<"Message"> | string
    text?: StringNullableFilter<"Message"> | string | null
    html?: StringNullableFilter<"Message"> | string | null
    fromName?: StringNullableFilter<"Message"> | string | null
    replyTo?: StringNullableFilter<"Message"> | string | null
    headers?: JsonNullableFilter<"Message">
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    attempts?: IntFilter<"Message"> | number
    lastError?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    queuedAt?: DateTimeFilter<"Message"> | Date | string
    sentAt?: DateTimeNullableFilter<"Message"> | Date | string | null
  }

  export type AuditLogUpsertWithWhereUniqueWithoutTenantInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutTenantInput, AuditLogUncheckedUpdateWithoutTenantInput>
    create: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutTenantInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutTenantInput, AuditLogUncheckedUpdateWithoutTenantInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutTenantInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutTenantInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    tenantId?: StringFilter<"AuditLog"> | string
    actorType?: EnumActorTypeFilter<"AuditLog"> | $Enums.ActorType
    actorId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    metadata?: JsonNullableFilter<"AuditLog">
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type TenantCreateWithoutUsersInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    smtpAccounts?: SmtpAccountCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyCreateNestedManyWithoutTenantInput
    templates?: TemplateCreateNestedManyWithoutTenantInput
    messages?: MessageCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    smtpAccounts?: SmtpAccountUncheckedCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutTenantInput
    templates?: TemplateUncheckedCreateNestedManyWithoutTenantInput
    messages?: MessageUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
  }

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smtpAccounts?: SmtpAccountUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutTenantNestedInput
    templates?: TemplateUpdateManyWithoutTenantNestedInput
    messages?: MessageUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smtpAccounts?: SmtpAccountUncheckedUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutTenantNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutTenantNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutSmtpAccountsInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyCreateNestedManyWithoutTenantInput
    templates?: TemplateCreateNestedManyWithoutTenantInput
    messages?: MessageCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSmtpAccountsInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutTenantInput
    templates?: TemplateUncheckedCreateNestedManyWithoutTenantInput
    messages?: MessageUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSmtpAccountsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSmtpAccountsInput, TenantUncheckedCreateWithoutSmtpAccountsInput>
  }

  export type ApiKeyPermissionCreateWithoutSmtpAccountInput = {
    apiKey: ApiKeyCreateNestedOneWithoutPermissionsInput
  }

  export type ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput = {
    apiKeyId: string
  }

  export type ApiKeyPermissionCreateOrConnectWithoutSmtpAccountInput = {
    where: ApiKeyPermissionWhereUniqueInput
    create: XOR<ApiKeyPermissionCreateWithoutSmtpAccountInput, ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput>
  }

  export type ApiKeyPermissionCreateManySmtpAccountInputEnvelope = {
    data: ApiKeyPermissionCreateManySmtpAccountInput | ApiKeyPermissionCreateManySmtpAccountInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutSmtpAccountInput = {
    id?: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutMessagesInput
    apiKey: ApiKeyCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutSmtpAccountInput = {
    id?: string
    tenantId: string
    apiKeyId: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
  }

  export type MessageCreateOrConnectWithoutSmtpAccountInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSmtpAccountInput, MessageUncheckedCreateWithoutSmtpAccountInput>
  }

  export type MessageCreateManySmtpAccountInputEnvelope = {
    data: MessageCreateManySmtpAccountInput | MessageCreateManySmtpAccountInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutSmtpAccountsInput = {
    update: XOR<TenantUpdateWithoutSmtpAccountsInput, TenantUncheckedUpdateWithoutSmtpAccountsInput>
    create: XOR<TenantCreateWithoutSmtpAccountsInput, TenantUncheckedCreateWithoutSmtpAccountsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSmtpAccountsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSmtpAccountsInput, TenantUncheckedUpdateWithoutSmtpAccountsInput>
  }

  export type TenantUpdateWithoutSmtpAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutTenantNestedInput
    templates?: TemplateUpdateManyWithoutTenantNestedInput
    messages?: MessageUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSmtpAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutTenantNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutTenantNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type ApiKeyPermissionUpsertWithWhereUniqueWithoutSmtpAccountInput = {
    where: ApiKeyPermissionWhereUniqueInput
    update: XOR<ApiKeyPermissionUpdateWithoutSmtpAccountInput, ApiKeyPermissionUncheckedUpdateWithoutSmtpAccountInput>
    create: XOR<ApiKeyPermissionCreateWithoutSmtpAccountInput, ApiKeyPermissionUncheckedCreateWithoutSmtpAccountInput>
  }

  export type ApiKeyPermissionUpdateWithWhereUniqueWithoutSmtpAccountInput = {
    where: ApiKeyPermissionWhereUniqueInput
    data: XOR<ApiKeyPermissionUpdateWithoutSmtpAccountInput, ApiKeyPermissionUncheckedUpdateWithoutSmtpAccountInput>
  }

  export type ApiKeyPermissionUpdateManyWithWhereWithoutSmtpAccountInput = {
    where: ApiKeyPermissionScalarWhereInput
    data: XOR<ApiKeyPermissionUpdateManyMutationInput, ApiKeyPermissionUncheckedUpdateManyWithoutSmtpAccountInput>
  }

  export type ApiKeyPermissionScalarWhereInput = {
    AND?: ApiKeyPermissionScalarWhereInput | ApiKeyPermissionScalarWhereInput[]
    OR?: ApiKeyPermissionScalarWhereInput[]
    NOT?: ApiKeyPermissionScalarWhereInput | ApiKeyPermissionScalarWhereInput[]
    apiKeyId?: StringFilter<"ApiKeyPermission"> | string
    smtpAccountId?: StringFilter<"ApiKeyPermission"> | string
  }

  export type MessageUpsertWithWhereUniqueWithoutSmtpAccountInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSmtpAccountInput, MessageUncheckedUpdateWithoutSmtpAccountInput>
    create: XOR<MessageCreateWithoutSmtpAccountInput, MessageUncheckedCreateWithoutSmtpAccountInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSmtpAccountInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSmtpAccountInput, MessageUncheckedUpdateWithoutSmtpAccountInput>
  }

  export type MessageUpdateManyWithWhereWithoutSmtpAccountInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSmtpAccountInput>
  }

  export type TenantCreateWithoutApiKeysInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountCreateNestedManyWithoutTenantInput
    templates?: TemplateCreateNestedManyWithoutTenantInput
    messages?: MessageCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutApiKeysInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountUncheckedCreateNestedManyWithoutTenantInput
    templates?: TemplateUncheckedCreateNestedManyWithoutTenantInput
    messages?: MessageUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutApiKeysInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutApiKeysInput, TenantUncheckedCreateWithoutApiKeysInput>
  }

  export type ApiKeyPermissionCreateWithoutApiKeyInput = {
    smtpAccount: SmtpAccountCreateNestedOneWithoutPermissionsInput
  }

  export type ApiKeyPermissionUncheckedCreateWithoutApiKeyInput = {
    smtpAccountId: string
  }

  export type ApiKeyPermissionCreateOrConnectWithoutApiKeyInput = {
    where: ApiKeyPermissionWhereUniqueInput
    create: XOR<ApiKeyPermissionCreateWithoutApiKeyInput, ApiKeyPermissionUncheckedCreateWithoutApiKeyInput>
  }

  export type ApiKeyPermissionCreateManyApiKeyInputEnvelope = {
    data: ApiKeyPermissionCreateManyApiKeyInput | ApiKeyPermissionCreateManyApiKeyInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutApiKeyInput = {
    id?: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutMessagesInput
    smtpAccount: SmtpAccountCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutApiKeyInput = {
    id?: string
    tenantId: string
    smtpAccountId: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
  }

  export type MessageCreateOrConnectWithoutApiKeyInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutApiKeyInput, MessageUncheckedCreateWithoutApiKeyInput>
  }

  export type MessageCreateManyApiKeyInputEnvelope = {
    data: MessageCreateManyApiKeyInput | MessageCreateManyApiKeyInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutApiKeysInput = {
    update: XOR<TenantUpdateWithoutApiKeysInput, TenantUncheckedUpdateWithoutApiKeysInput>
    create: XOR<TenantCreateWithoutApiKeysInput, TenantUncheckedCreateWithoutApiKeysInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutApiKeysInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutApiKeysInput, TenantUncheckedUpdateWithoutApiKeysInput>
  }

  export type TenantUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUpdateManyWithoutTenantNestedInput
    templates?: TemplateUpdateManyWithoutTenantNestedInput
    messages?: MessageUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUncheckedUpdateManyWithoutTenantNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutTenantNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type ApiKeyPermissionUpsertWithWhereUniqueWithoutApiKeyInput = {
    where: ApiKeyPermissionWhereUniqueInput
    update: XOR<ApiKeyPermissionUpdateWithoutApiKeyInput, ApiKeyPermissionUncheckedUpdateWithoutApiKeyInput>
    create: XOR<ApiKeyPermissionCreateWithoutApiKeyInput, ApiKeyPermissionUncheckedCreateWithoutApiKeyInput>
  }

  export type ApiKeyPermissionUpdateWithWhereUniqueWithoutApiKeyInput = {
    where: ApiKeyPermissionWhereUniqueInput
    data: XOR<ApiKeyPermissionUpdateWithoutApiKeyInput, ApiKeyPermissionUncheckedUpdateWithoutApiKeyInput>
  }

  export type ApiKeyPermissionUpdateManyWithWhereWithoutApiKeyInput = {
    where: ApiKeyPermissionScalarWhereInput
    data: XOR<ApiKeyPermissionUpdateManyMutationInput, ApiKeyPermissionUncheckedUpdateManyWithoutApiKeyInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutApiKeyInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutApiKeyInput, MessageUncheckedUpdateWithoutApiKeyInput>
    create: XOR<MessageCreateWithoutApiKeyInput, MessageUncheckedCreateWithoutApiKeyInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutApiKeyInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutApiKeyInput, MessageUncheckedUpdateWithoutApiKeyInput>
  }

  export type MessageUpdateManyWithWhereWithoutApiKeyInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutApiKeyInput>
  }

  export type ApiKeyCreateWithoutPermissionsInput = {
    id?: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    tenant: TenantCreateNestedOneWithoutApiKeysInput
    messages?: MessageCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUncheckedCreateWithoutPermissionsInput = {
    id?: string
    tenantId: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    messages?: MessageUncheckedCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyCreateOrConnectWithoutPermissionsInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutPermissionsInput, ApiKeyUncheckedCreateWithoutPermissionsInput>
  }

  export type SmtpAccountCreateWithoutPermissionsInput = {
    id?: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSmtpAccountsInput
    messages?: MessageCreateNestedManyWithoutSmtpAccountInput
  }

  export type SmtpAccountUncheckedCreateWithoutPermissionsInput = {
    id?: string
    tenantId: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutSmtpAccountInput
  }

  export type SmtpAccountCreateOrConnectWithoutPermissionsInput = {
    where: SmtpAccountWhereUniqueInput
    create: XOR<SmtpAccountCreateWithoutPermissionsInput, SmtpAccountUncheckedCreateWithoutPermissionsInput>
  }

  export type ApiKeyUpsertWithoutPermissionsInput = {
    update: XOR<ApiKeyUpdateWithoutPermissionsInput, ApiKeyUncheckedUpdateWithoutPermissionsInput>
    create: XOR<ApiKeyCreateWithoutPermissionsInput, ApiKeyUncheckedCreateWithoutPermissionsInput>
    where?: ApiKeyWhereInput
  }

  export type ApiKeyUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: ApiKeyWhereInput
    data: XOR<ApiKeyUpdateWithoutPermissionsInput, ApiKeyUncheckedUpdateWithoutPermissionsInput>
  }

  export type ApiKeyUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    tenant?: TenantUpdateOneRequiredWithoutApiKeysNestedInput
    messages?: MessageUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    messages?: MessageUncheckedUpdateManyWithoutApiKeyNestedInput
  }

  export type SmtpAccountUpsertWithoutPermissionsInput = {
    update: XOR<SmtpAccountUpdateWithoutPermissionsInput, SmtpAccountUncheckedUpdateWithoutPermissionsInput>
    create: XOR<SmtpAccountCreateWithoutPermissionsInput, SmtpAccountUncheckedCreateWithoutPermissionsInput>
    where?: SmtpAccountWhereInput
  }

  export type SmtpAccountUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: SmtpAccountWhereInput
    data: XOR<SmtpAccountUpdateWithoutPermissionsInput, SmtpAccountUncheckedUpdateWithoutPermissionsInput>
  }

  export type SmtpAccountUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSmtpAccountsNestedInput
    messages?: MessageUpdateManyWithoutSmtpAccountNestedInput
  }

  export type SmtpAccountUncheckedUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutSmtpAccountNestedInput
  }

  export type TenantCreateWithoutMessagesInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyCreateNestedManyWithoutTenantInput
    templates?: TemplateCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutMessagesInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountUncheckedCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutTenantInput
    templates?: TemplateUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutMessagesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutMessagesInput, TenantUncheckedCreateWithoutMessagesInput>
  }

  export type ApiKeyCreateWithoutMessagesInput = {
    id?: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    tenant: TenantCreateNestedOneWithoutApiKeysInput
    permissions?: ApiKeyPermissionCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUncheckedCreateWithoutMessagesInput = {
    id?: string
    tenantId: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    permissions?: ApiKeyPermissionUncheckedCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyCreateOrConnectWithoutMessagesInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutMessagesInput, ApiKeyUncheckedCreateWithoutMessagesInput>
  }

  export type SmtpAccountCreateWithoutMessagesInput = {
    id?: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSmtpAccountsInput
    permissions?: ApiKeyPermissionCreateNestedManyWithoutSmtpAccountInput
  }

  export type SmtpAccountUncheckedCreateWithoutMessagesInput = {
    id?: string
    tenantId: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    permissions?: ApiKeyPermissionUncheckedCreateNestedManyWithoutSmtpAccountInput
  }

  export type SmtpAccountCreateOrConnectWithoutMessagesInput = {
    where: SmtpAccountWhereUniqueInput
    create: XOR<SmtpAccountCreateWithoutMessagesInput, SmtpAccountUncheckedCreateWithoutMessagesInput>
  }

  export type TenantUpsertWithoutMessagesInput = {
    update: XOR<TenantUpdateWithoutMessagesInput, TenantUncheckedUpdateWithoutMessagesInput>
    create: XOR<TenantCreateWithoutMessagesInput, TenantUncheckedCreateWithoutMessagesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutMessagesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutMessagesInput, TenantUncheckedUpdateWithoutMessagesInput>
  }

  export type TenantUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutTenantNestedInput
    templates?: TemplateUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUncheckedUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutTenantNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type ApiKeyUpsertWithoutMessagesInput = {
    update: XOR<ApiKeyUpdateWithoutMessagesInput, ApiKeyUncheckedUpdateWithoutMessagesInput>
    create: XOR<ApiKeyCreateWithoutMessagesInput, ApiKeyUncheckedCreateWithoutMessagesInput>
    where?: ApiKeyWhereInput
  }

  export type ApiKeyUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ApiKeyWhereInput
    data: XOR<ApiKeyUpdateWithoutMessagesInput, ApiKeyUncheckedUpdateWithoutMessagesInput>
  }

  export type ApiKeyUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    tenant?: TenantUpdateOneRequiredWithoutApiKeysNestedInput
    permissions?: ApiKeyPermissionUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    permissions?: ApiKeyPermissionUncheckedUpdateManyWithoutApiKeyNestedInput
  }

  export type SmtpAccountUpsertWithoutMessagesInput = {
    update: XOR<SmtpAccountUpdateWithoutMessagesInput, SmtpAccountUncheckedUpdateWithoutMessagesInput>
    create: XOR<SmtpAccountCreateWithoutMessagesInput, SmtpAccountUncheckedCreateWithoutMessagesInput>
    where?: SmtpAccountWhereInput
  }

  export type SmtpAccountUpdateToOneWithWhereWithoutMessagesInput = {
    where?: SmtpAccountWhereInput
    data: XOR<SmtpAccountUpdateWithoutMessagesInput, SmtpAccountUncheckedUpdateWithoutMessagesInput>
  }

  export type SmtpAccountUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSmtpAccountsNestedInput
    permissions?: ApiKeyPermissionUpdateManyWithoutSmtpAccountNestedInput
  }

  export type SmtpAccountUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissions?: ApiKeyPermissionUncheckedUpdateManyWithoutSmtpAccountNestedInput
  }

  export type TenantCreateWithoutTemplatesInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyCreateNestedManyWithoutTenantInput
    messages?: MessageCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutTemplatesInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountUncheckedCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutTenantInput
    messages?: MessageUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutTemplatesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutTemplatesInput, TenantUncheckedCreateWithoutTemplatesInput>
  }

  export type TenantUpsertWithoutTemplatesInput = {
    update: XOR<TenantUpdateWithoutTemplatesInput, TenantUncheckedUpdateWithoutTemplatesInput>
    create: XOR<TenantCreateWithoutTemplatesInput, TenantUncheckedCreateWithoutTemplatesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutTemplatesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutTemplatesInput, TenantUncheckedUpdateWithoutTemplatesInput>
  }

  export type TenantUpdateWithoutTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutTenantNestedInput
    messages?: MessageUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUncheckedUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutTenantNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyCreateNestedManyWithoutTenantInput
    templates?: TemplateCreateNestedManyWithoutTenantInput
    messages?: MessageCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    plan?: string
    status?: $Enums.TenantStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    dailySentCount?: number
    dailyCountResetAt?: Date | string | null
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    smtpAccounts?: SmtpAccountUncheckedCreateNestedManyWithoutTenantInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutTenantInput
    templates?: TemplateUncheckedCreateNestedManyWithoutTenantInput
    messages?: MessageUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutAuditLogsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
  }

  export type TenantUpsertWithoutAuditLogsInput = {
    update: XOR<TenantUpdateWithoutAuditLogsInput, TenantUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAuditLogsInput, TenantUncheckedUpdateWithoutAuditLogsInput>
  }

  export type TenantUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutTenantNestedInput
    templates?: TemplateUpdateManyWithoutTenantNestedInput
    messages?: MessageUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailySentCount?: IntFieldUpdateOperationsInput | number
    dailyCountResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    smtpAccounts?: SmtpAccountUncheckedUpdateManyWithoutTenantNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutTenantNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutTenantNestedInput
    messages?: MessageUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserCreateManyTenantInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    lastLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SmtpAccountCreateManyTenantInput = {
    id?: string
    label: string
    gmailAddress: string
    encryptedAppPassword: string
    iv: string
    authTag: string
    keyVersion: string
    status?: $Enums.SenderStatus
    perMinuteLimit?: number
    perDayLimit?: number
    sentTodayCount?: number
    sentTodayResetAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastErrorAt?: Date | string | null
    errorStreak?: number
    healthScore?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApiKeyCreateManyTenantInput = {
    id?: string
    name: string
    keyHash: string
    prefix: string
    status?: $Enums.ApiKeyStatus
    createdAt?: Date | string
    revokedAt?: Date | string | null
    rateLimitPerMinute?: number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TemplateCreateManyTenantInput = {
    id?: string
    name: string
    subject: string
    html: string
    text?: string | null
    status?: $Enums.TemplateStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageCreateManyTenantInput = {
    id?: string
    apiKeyId: string
    smtpAccountId: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
  }

  export type AuditLogCreateManyTenantInput = {
    id?: string
    actorType: $Enums.ActorType
    actorId: string
    action: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmtpAccountUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissions?: ApiKeyPermissionUpdateManyWithoutSmtpAccountNestedInput
    messages?: MessageUpdateManyWithoutSmtpAccountNestedInput
  }

  export type SmtpAccountUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissions?: ApiKeyPermissionUncheckedUpdateManyWithoutSmtpAccountNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSmtpAccountNestedInput
  }

  export type SmtpAccountUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    gmailAddress?: StringFieldUpdateOperationsInput | string
    encryptedAppPassword?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    authTag?: StringFieldUpdateOperationsInput | string
    keyVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumSenderStatusFieldUpdateOperationsInput | $Enums.SenderStatus
    perMinuteLimit?: IntFieldUpdateOperationsInput | number
    perDayLimit?: IntFieldUpdateOperationsInput | number
    sentTodayCount?: IntFieldUpdateOperationsInput | number
    sentTodayResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastErrorAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorStreak?: IntFieldUpdateOperationsInput | number
    healthScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    permissions?: ApiKeyPermissionUpdateManyWithoutApiKeyNestedInput
    messages?: MessageUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
    permissions?: ApiKeyPermissionUncheckedUpdateManyWithoutApiKeyNestedInput
    messages?: MessageUncheckedUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    prefix?: StringFieldUpdateOperationsInput | string
    status?: EnumApiKeyStatusFieldUpdateOperationsInput | $Enums.ApiKeyStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rateLimitPerMinute?: IntFieldUpdateOperationsInput | number
    allowedIps?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TemplateUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    html?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTemplateStatusFieldUpdateOperationsInput | $Enums.TemplateStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    html?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTemplateStatusFieldUpdateOperationsInput | $Enums.TemplateStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    html?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTemplateStatusFieldUpdateOperationsInput | $Enums.TemplateStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    apiKey?: ApiKeyUpdateOneRequiredWithoutMessagesNestedInput
    smtpAccount?: SmtpAccountUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    apiKeyId?: StringFieldUpdateOperationsInput | string
    smtpAccountId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    apiKeyId?: StringFieldUpdateOperationsInput | string
    smtpAccountId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: EnumActorTypeFieldUpdateOperationsInput | $Enums.ActorType
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: EnumActorTypeFieldUpdateOperationsInput | $Enums.ActorType
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: EnumActorTypeFieldUpdateOperationsInput | $Enums.ActorType
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyPermissionCreateManySmtpAccountInput = {
    apiKeyId: string
  }

  export type MessageCreateManySmtpAccountInput = {
    id?: string
    tenantId: string
    apiKeyId: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
  }

  export type ApiKeyPermissionUpdateWithoutSmtpAccountInput = {
    apiKey?: ApiKeyUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type ApiKeyPermissionUncheckedUpdateWithoutSmtpAccountInput = {
    apiKeyId?: StringFieldUpdateOperationsInput | string
  }

  export type ApiKeyPermissionUncheckedUpdateManyWithoutSmtpAccountInput = {
    apiKeyId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageUpdateWithoutSmtpAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutMessagesNestedInput
    apiKey?: ApiKeyUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutSmtpAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    apiKeyId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageUncheckedUpdateManyWithoutSmtpAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    apiKeyId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyPermissionCreateManyApiKeyInput = {
    smtpAccountId: string
  }

  export type MessageCreateManyApiKeyInput = {
    id?: string
    tenantId: string
    smtpAccountId: string
    idempotencyKey: string
    to: JsonNullValueInput | InputJsonValue
    cc: JsonNullValueInput | InputJsonValue
    bcc: JsonNullValueInput | InputJsonValue
    subject: string
    text?: string | null
    html?: string | null
    fromName?: string | null
    replyTo?: string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.MessageStatus
    attempts?: number
    lastError?: string | null
    createdAt?: Date | string
    queuedAt?: Date | string
    sentAt?: Date | string | null
  }

  export type ApiKeyPermissionUpdateWithoutApiKeyInput = {
    smtpAccount?: SmtpAccountUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type ApiKeyPermissionUncheckedUpdateWithoutApiKeyInput = {
    smtpAccountId?: StringFieldUpdateOperationsInput | string
  }

  export type ApiKeyPermissionUncheckedUpdateManyWithoutApiKeyInput = {
    smtpAccountId?: StringFieldUpdateOperationsInput | string
  }

  export type MessageUpdateWithoutApiKeyInput = {
    id?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutMessagesNestedInput
    smtpAccount?: SmtpAccountUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutApiKeyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    smtpAccountId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageUncheckedUpdateManyWithoutApiKeyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    smtpAccountId?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    cc?: JsonNullValueInput | InputJsonValue
    bcc?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    html?: NullableStringFieldUpdateOperationsInput | string | null
    fromName?: NullableStringFieldUpdateOperationsInput | string | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    headers?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}