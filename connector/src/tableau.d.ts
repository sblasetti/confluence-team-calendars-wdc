/**
 * Created by jdunk on 04/06/2016.
 */
declare module tableau {
    export type tPhase = "interactive" | "auth" | "gatherData";
    export interface PhaseEnum {
        interactivePhase: tPhase;
        authPhase: tPhase;
        gatherDataPhase: tPhase;
    }

    export type tAuthPurpose = "ephemeral" | "enduring";
    export interface AuthPurposeEnum {
        ephemeral: tAuthPurpose;
        enduring: tAuthPurpose;
    }

    export type tAuthType = "none" | "basic" | "custom";
    export interface AuthTypeEnum {
        none: tAuthType;
        basic: tAuthType;
        custom: tAuthType;
    }

    export type tDataType = "bool" | "date" | "datetime" | "float" | "int" | "string";
    export interface DataTypeEnum {
        bool: tDataType;
        date: tDataType;
        datetime: tDataType;
        float: tDataType;
        int: tDataType;
        string: tDataType;
    }

    export type tColumnRole = "dimension" | "measure";
    export interface ColumnRoleEnum {
        dimension: tColumnRole;
        measure: tColumnRole;
    }

    export type tColumnType = "continuous" | "discrete";
    export interface ColumnTypeEnum {
        continuous: tColumnType;
        discrete: tColumnType;
    }

    export type tAggType = "sum" | "avg" | "median" | "count" | "count_dist";
    export interface AggTypeEnum {
        sum: tAggType;
        avg: tAggType;
        median: tAggType;
        count: tAggType;
        countd: tAggType;
    }

    export type tGeographicRole = "area_code" | "cbsa_msa" | "city" | "congressional_district" | "country_region" | "county" | "state_province" | "zip_code_postcode";
    export interface GeographicRoleEnum {
        area_code: tGeographicRole;
        cbsa_msa: tGeographicRole;
        city: tGeographicRole;
        congressional_district: tGeographicRole;
        country_region: tGeographicRole;
        county: tGeographicRole;
        state_province: tGeographicRole;
        zip_code_postcode: tGeographicRole;
    }

    export type tUnitsFormat = "thousands" | "millions" | "billions_english" | "billions_standard";
    export interface UnitsFormatEnum {
        thousands: tUnitsFormat;
        millions: tUnitsFormat;
        billions_english: tUnitsFormat;
        billions_standard: tUnitsFormat;
    }

    export type tNumberFormat = "number" | "currency" | "scientific" | "percentage";
    export interface NumberFormatEnum {
        number: tNumberFormat;
        currency: tNumberFormat;
        scientific: tNumberFormat;
        percentage: tNumberFormat;
    }

    export type tLocale = "en-us" | "pt-br" | "zh-cn" | "fr-fr" | "de-de" | "ja-jp" | "ko-kr" | "es-es";
    export interface LocaleEnum {
        america: tLocale;
        brazil: tLocale;
        china: tLocale;
        france: tLocale;
        germany: tLocale;
        japan: tLocale;
        korea: tLocale;
        spain: tLocale;
    }

    export interface DataDoneCallback {
        (): void
    }

    export interface InitCallback {
        (): void
    }

    export interface SchemaCallback {
        (tableInfo: TableInfo[]): void
    }

    export interface ShutdownCallback {
        (): void
    }
    
    export interface WebDataConnector {
        getData(table: Table, doneCallback: DataDoneCallback): void;
        getSchema(schemaCallback: SchemaCallback): void;
        init(initCallBack: InitCallback): void;
        shutdown(shutdownCallback: ShutdownCallback): void;
    }

    export interface ColumnInfo {
        id: string;
        dataType: tDataType;
        aggType?: tAggType;
        alias?: string;
        description?: string;
        columnRole?: tColumnRole;
        columnType?: tColumnType;
        geographicRole?: tGeographicRole;
        numberFormat?: tNumberFormat;
        unitsFormat?: tUnitsFormat;
    }

    export interface TableInfo {
        id: string;
        columns: ColumnInfo[];
        alias?: string;
        description?: string;
        incrementColumnId?: string;
    }

    export interface Table {
        tableInfo: TableInfo;
        incrementValue: string;
        appendRows(rows: any[][]): any;
    }

    var versionNumber: string;
    var version: string;

    var phaseEnum: PhaseEnum;
    var authPurposeEnum: AuthPurposeEnum;
    var authTypeEnum: AuthTypeEnum;
    var dataTypeEnum: DataTypeEnum;
    var columnRoleEnum: ColumnRoleEnum;
    var columnTypeEnum : ColumnTypeEnum;
    var aggTypeEnum: AggTypeEnum;
    var geographicRoleEnum: GeographicRoleEnum;
    var localeEnum: LocaleEnum;
    var unitsFormatEnum: UnitsFormatEnum;
    var numberFormatEnum: NumberFormatEnum;

    function makeConnector(): WebDataConnector;
    function registerConnector(wdc: WebDataConnector): void;

    function submit(): void;
    function log(msg: string): void;

    function abortWithError(msg: string): void;
    function abortForAuth(msg: string): void;

    var authPurpose: tAuthPurpose;
    var authType: tAuthType;
    var phase: tPhase;

    var connectionName: string;
    var connectionData: any;
    var locale: string;
    var username: string;
    var password: any;
}