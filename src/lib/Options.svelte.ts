// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 Jani Nikula <jani@nikula.org>

export type SavedName = {
  id: number;
  name: string;
};

export class Options {
  names: SavedName[] = $state([]);
  private _savename: string;

  num_reds: number = $state();
  randomize: number = $state(1);

  constructor(saveprefix: string) {
    this._savename = `${saveprefix}-names`;
    this.reload();
  }

  reload(): void {
    let names: SavedName[] = this._load();

    if (!names) {
      names = [];
      for (let i of [1,2,3])
	names.push({ id: i, name: `Player ${i}`});
    }

    this.names.splice(0, 3, ...names);
    this.num_reds = 15;
  }

  // load names from local storage
  private _load(): SavedName[] {
    let names_json = localStorage.getItem(this._savename);
    if (!names_json)
      return null;

    try {
      let names = JSON.parse(names_json);

      if (!Array.isArray(names) || names.length != 3)
	return null;

      return names;
    } catch (e) {
      return null;
    }
  }

  save(): void {
    localStorage.setItem(this._savename, JSON.stringify(this.names));
  }

  valid_name(name: string): boolean {
    if (!name)
      return false;

    let dupes = this.names.filter((x) => x.name.toUpperCase() === name.toUpperCase());

    return dupes.length === 1;
  }

  private _all_valid(): boolean {
    return this.names.filter((x) => !this.valid_name(x.name)).length === 0;
  }

  can_new_game(): boolean {
    return this._all_valid();
  }
}
