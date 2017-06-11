// Type definitions for dynamoose 0.7
// Project: https://github.com/automategreen/dynamoose
// Definitions by: Rahul Vaidya <https://github.com/rvaidya>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "dynamoose" {
	import AWS from 'aws-sdk';

	export class Dynamoose {
		constructor();
		Dynamoose(): void;
		Schema(obj: any, options: any): Schema;
		Table(name: string, schema: any, options: any, base: any): Table;
		VirtualType(options: any, name: string): VirtualType;
		ddb(): AWS.DynamoDB;
		local(url: string): void;
		model(name: string, schema: Schema, options?: ModelOptions): Model;
		setDefaults(options: Options): void;
	}
	export class Schema {
		constructor(obj: SchemaObject, options?: SchemaOptions);
		method(name: string, fn: any): any;
		parseDynamo(model: any, dynamoObj: any): any;
		static(name: string, fn: any): any;
		toDynamo(model: any): any;
		virtual(name: string, options: any): any;
		virtualpath(name: string): any;
	}
	export class Table {
		constructor(name: string, schema: any, options: any, base: any);
		create(next: any): any;
		createIndex(attributes: any, indexSpec: any): any;
		delete(next: any): any;
		deleteIndex(indexname: string): any;
		describe(next: any): any;
		init(next: any): any;
		update(next: any): any;
		waitForActive(timeout: any, next: any): any;
	}
	export class Model {
		constructor(obj: ModelObject);
		put(options, callback: (err, obj) => void);
		save(options, callback: (err, obj) => void);
		delete(callback: (err) => void);
		delete(key, options, callback: (err) => void);
		get<T>(key, options?, callback?: (err, obj) => void): Promise<T>;
		batchPut(items: ModelObject[], options, callback: (err, obj) => void);
		create<T>(obj: T, callback: (err, obj: T) => void);
		create<T>(obj: T, options, callback: (err, obj: T) => void);
		batchGet<T>(keys, options?, callback?: (err, obj) => void): Promise<T[]>;
		batchDelete(keys, options, callback: (err) => void);
		query<T>(query, options, callback: (err, results: T[]) => void): void;
		query<T>(query, callback: (err, results: T[]) => void): void;
		query<T>(key: string): Query<T>;
		queryOne<T>(query, options, callback: (err, results: T[]) => void): void;
		queryOne<T>(query, callback: (err, results: T[]) => void): void;
		queryOne<T>(key: string): Query<T>;
		scan<T>(filter, options, callback: (err, results: T[]) => void): void;
		scan<T>(filter, callback: (err, results: T[]) => void): void;
		scan<T>(filter: string): Scan<T>;
		update(key, update, options, callback: (err) => void);
	}
	export class VirtualType {
		constructor(options: any, name: string);
		applyVirtuals(model: any): void;
		get(fn: any): any;
		set(fn: any): any;
	}

	export function ddb(): AWS.DynamoDB;
	export function local(url: string): void;
	export function model(name: string, schema: Schema, options?: ModelOptions): Model;
	export function setDefaults(options: Options): void;
	export import AWS = AWS;

	export default {
		ddb: ddb,
		local: local,
		model: model,
		setDefaults: setDefaults,
		AWS: AWS,
		Schema: Schema
	};

	// Global options
	export interface Options {
		create?: boolean;
		prefix?: string;
		waitForActive?: boolean;
		waitForActiveTimeout?: number;
	}

	// tslint:disable-next-line:forbidden-types THIS IS INTENTIONAL, THESE ARE ARGUMENTS FOR THE LIBRARY
	type ST = String | Number | Boolean | Date | Object;
	type TT = ST | ST[] | Buffer;
	export interface ModelObject {
		[key: string]: TT;
	}
	export interface SchemaObject {
		[key: string]: {
			type: TT;
			hashKey?: boolean;
			rangeKey?: boolean;
			required?: boolean;
			index?: boolean | {
				name: string,
				global?: boolean
				rangeKey?: string
				project?: boolean | string[],
				throughput?: number | { read?: number, write?: number };
			};
			default?: () => TT | TT;
			validate?: (value: TT) => boolean | RegExp | TT;
			set?: (value: TT) => void;
			get?: () => TT;
			trim?: boolean;
			lowercase?: boolean;
			uppercase?: boolean;
		};
	}

	// Schema options
	export interface SchemaOptions {
		throughput?: number | { read?: number, write?: number };
		timestamps?: boolean | { createdAt?: string, updatedAt?: string };
	}

	// Model options
	export interface ModelOptions {
		overwrite?: boolean;
		condition?: string;
		conditionNames: any;
		conditionValues: any;
	}

	export class Query<T> {
		exec(callback: (err, objs: T[]) => void): void;
		exec(): Promise<T[]>;
		where(rangeKey: string): Query<T>;
		filter(filter: string): Query<T>;
		and(): Query<T>;
		or(): Query<T>;
		not(): Query<T>;
		null(): Query<T>;
		eq(value: string): Query<T>;
		lt(value): Query<T>;
		le(value): Query<T>;
		ge(value): Query<T>;
		gt(value): Query<T>;
		beginsWith(value): Query<T>;
		between(valueA, valueB): Query<T>;
		contains(value): Query<T>;
		beginsWith(value): Query<T>;
		in(values): Query<T>;
		limit(limit: number): Query<T>;
		consistent(): Query<T>;
		descending(): Query<T>;
		ascending(): Query<T>;
		startAt(key): Query<T>;
		attributes(attributes): Query<T>;
	}

	export class Scan<T> {
		exec(callback: (err, objs: T[]) => void): void;
		exec(): Promise<T[]>;
		where(rangeKey: string): Scan<T>;
		filter(filter: string): Scan<T>;
		and(): Scan<T>;
		not(): Scan<T>;
		null(): Scan<T>;
		eq(value: string): Scan<T>;
		lt(value): Scan<T>;
		le(value): Scan<T>;
		ge(value): Scan<T>;
		gt(value): Scan<T>;
		beginsWith(value): Scan<T>;
		between(valueA, valueB): Scan<T>;
		contains(value): Scan<T>;
		beginsWith(value): Scan<T>;
		in(values): Scan<T>;
		limit(limit: number): Scan<T>;
		startAt(key): Scan<T>;
		attributes(attributes): Scan<T>;
	}
}
