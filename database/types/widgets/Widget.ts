// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

/** Identifier type for widget */
export type WidgetId = string;

/** Represents the table widgets.widget */
export default interface WidgetTable {
  id: ColumnType<WidgetId, WidgetId | undefined, WidgetId>;

  name: ColumnType<string, string, string>;
}

export type Widget = Selectable<WidgetTable>;

export type NewWidget = Insertable<WidgetTable>;

export type WidgetUpdate = Updateable<WidgetTable>;