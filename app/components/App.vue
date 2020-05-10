<template>
    <Page class="page">
        <ActionBar title="Tagpacker" class="action-bar" />
        <StackLayout orientation="vertical" width="100%" height="100%">

            <GridLayout rows="*" width="100%" height="50">
                <TextField col="0" row="0" v-model="urlField" hint="Type URL to save" editable="true" @textChange="getLinkDetails" />
            </GridLayout>

            <GridLayout rows="*" width="100%" height="50">
                <TextField col="0" row="0" v-model="titleField" hint="Type title" editable="true" />
            </GridLayout>

            <GridLayout columns="2*,*" rows="*" width="100%" height="50">
                <TextField col="0" row="0" v-model="tagField" hint="Type tags" editable="true" @textChange="tagsSearch" />
                <Button col="1" row="0" text="Add" @tap="addNewTag" />
            </GridLayout>

            <FlexboxLayout class="tags-cover tags-cover-selected" alignItems="flex-start">
                <Label
                        v-for="(tag, key) in tagsAdded"
                        v-bind:key="key"
                        backgroundColor="#898888"
                        class="tag-bot"
                        :text="tag.name"
                        @tap="removeSelectedTag(tag)"
                />
            </FlexboxLayout>

            <FlexboxLayout class="tags-cover tags-cover-found" alignItems="flex-start">
                <Label
                        v-for="(tag, key) in tags"
                        v-bind:key="key"
                        backgroundColor="#cccece"
                        class="tag-bot"
                        :text="tag.name"
                        @tap="addSelectedTag(tag)"
                />
            </FlexboxLayout>

            <Button text="Save tag" @tap="saveLnk" />
        </StackLayout>
    </Page>
</template>

<script>
    const application = require("tns-core-modules/application")
    export default {
        data() {
            return {
                description: "",
                linkId: "",
                tagsAdded: [],
                tagField: "",
                titleField: "",
                urlField: "",
            };
        },
        computed: {
            errorMessage: function() {
                return this.$store.getters.link.errorMessage
            },
            isLink: function() {
                return this.$store.getters.link.isLink
            },
            loadedLink: function() {
                return this.$store.getters.link.loadedLink
            },
            savedLink: function() {
                return this.$store.getters.link.savedLink
            },
            tags: function() {
                return this.$store.getters.tag.tags
            },
            updatedLink: function() {
                return this.$store.getters.link.updatedLink
            },
        },
        watch: {
            isLink(newValue) {
                if (!newValue) {
                    return
                }
                this.preloadLinkDetails(this.loadedLink)
            },
            savedLink(newValue) {
                if (!newValue) {
                    return
                }

                if (this.errorMessage === "") {
                    alert({
                        title: "Successfully",
                        message: "Link saved",
                        okButtonText: "OK"
                    })
                    this.cleanFields()
                    return
                }
                alert({
                    title: "Alert",
                    message: "Error saving link",
                    okButtonText: "OK"
                })
            },
            updatedLink(newValue) {
                if (!newValue) {
                    return
                }

                if (this.errorMessage === "") {
                    alert({
                        title: "Successfully",
                        message: "Link updated",
                        okButtonText: "OK"
                    })
                    this.cleanFields()
                    return
                }
                alert({
                    title: "Alert",
                    message: "Error updating link",
                    okButtonText: "OK"
                })
            },
        },
        methods: {
            addNewTag() {
                const tag = {
                    name: this.tagField,
                }
                this.tagsAdded.push(tag)
                this.tagField = ""
            },
            addSelectedTag(tag) {
                this.tagsAdded.push(tag)
                this.tagField = ""
            },
            cleanFields() {
                this.linkId = ""
                this.description = ""
                this.urlField = ""
                this.titleField = ""
                this.tagField = ""
                this.tagsAdded = []
                this.$store.dispatch('cleanTags')
            },
            getLinkDetails() {
                if (this.urlField === "") {
                    return
                }
                this.$store.dispatch('getLink', this.urlField)
            },
            listenForShared() {
                if (!application.android) {
                    return
                }
                let $el = this
                application.android.on(application.AndroidApplication.activityResumedEvent, function (args) {
                    try {
                        let a = args.activity
                        let Intent_1 = android.content.Intent
                        let argIntent = a.getIntent()
                        let argIntentType = argIntent.getType()
                        if (argIntentType !== "text/plain") {
                            return
                        }

                        $el.setShared(argIntent.getStringExtra(Intent_1.EXTRA_TEXT))
                    } catch (e) {
                        console.log(e)
                    }
                })
            },
            preloadLinkDetails(link) {
                this.linkId = link.id
                this.titleField = link.title
                this.description = link.description
                this.tagsAdded = link.tags
            },
            removeSelectedTag(tag) {
                for (let i = 0; i < this.tagsAdded.length; i++) {
                    if (this.tagsAdded[i].name === tag.name) {
                        this.tagsAdded.splice(i, 1)
                        return
                    }
                }
            },
            saveLnk() {
                const data = {
                    description: this.description,
                    isPrivate: false,
                    sourceUrl: this.urlField,
                    title: this.titleField,
                    tags: this.tagsAdded,
                }
                if (this.linkId !== "") {
                    data.id = this.linkId
                    this.$store.dispatch('updateLnk', data)
                    return
                }

                this.$store.dispatch('saveLnk', data)
            },
            setShared(url) {
                if (url !== "") {
                    this.urlField = url
                    this.getLinkDetails()
                }
            },
            tagsSearch() {
                if (this.tagField.length < 3) {
                    return;
                }
                this.$store.dispatch('filterTags', this.tagField)
            },
        },
        created() {
            this.listenForShared()
        },
    }
</script>

<style scoped>
    .tags-cover {
        width: 100%;
        margin-top: 10;
        padding-left: 10;
        padding-right: 10;
    }

    .tags-cover-selected {
        margin-bottom: 20;
    }

    .tags-cover-found {
        height: 100;
    }

    .tag-bot {
        font-size: 16;
        font-weight: bold;
        margin-left: 7;
        margin-right: 7;
        padding: 7;
    }
</style>