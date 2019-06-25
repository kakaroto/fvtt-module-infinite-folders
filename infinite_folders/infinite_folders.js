
Folder._populateRecursive = function(parent, pending, entities) {
    let folders;
    [pending, folders, entities] = this._populate(parent, pending, entities);
    for ( let f of folders ) {
	let children;
	[pending, children, entities] = this._populateRecursive(f, pending, entities);
	// Confirm visibility
	f.children = f.children.filter(f => f.visible);
    }
    folders = folders.filter(f => f.visible || (f.children && f.children.some(c => c.visible)));
    return [pending, folders, entities];
}

Folder._infinite_folders_original_setupFolders = Folder.setupFolders;
Folder.setupFolders = function(entityType, entities) {
    let pending = game.data.folders.filter(f => f.type === entityType);
    entities = entities.filter(a => a.visible);
    let folders;

    // Top-level folders
    [pending, folders, entities] = this._populateRecursive({_id: null}, pending, entities);

    // Return the tree and remaining unallocated entities
    return [folders, entities];
}


replaceDefaultOptions = function(class_) {
    defaultOptionsProperty = Object.getOwnPropertyDescriptor(class_, "defaultOptions");
    if (defaultOptionsProperty == undefined) {
	defaultOptionsProperty = Object.getOwnPropertyDescriptor(SidebarDirectory, "defaultOptions");
    }
    Object.defineProperty(class_, '_infinite_folders_defaultOptions', defaultOptionsProperty);
    Object.defineProperty(class_, 'defaultOptions', {
	get: function () {
	    def_options = class_._infinite_folders_defaultOptions
	    def_options.template = def_options.template.replace("templates/sidebar/", "public/modules/infinite_folders/templates/")
	    return def_options
	}
    });
};

replaceDefaultOptions(JournalDirectory);
replaceDefaultOptions(ActorDirectory);
replaceDefaultOptions(SceneDirectory);
replaceDefaultOptions(ItemDirectory);

