import { Component, ConverterComponent } from "../components";
import type { Context } from "../../converter";
import { ConverterEvents } from "../converter-events";
import { BindOption, ValidationOptions } from "../../utils";
import { DeclarationReflection } from "../../models";

/**
 * A plugin that resolves `{@link Foo}` tags.
 */
@Component({ name: "link-resolver" })
export class LinkResolverPlugin extends ConverterComponent {
    @BindOption("validation")
    validation!: ValidationOptions;

    /**
     * Create a new LinkResolverPlugin instance.
     */
    override initialize() {
        super.initialize();
        this.owner.on(ConverterEvents.RESOLVE_END, this.onResolve, this, -300);
    }

    onResolve(context: Context) {
        for (const reflection of Object.values(context.project.reflections)) {
            if (reflection.comment) {
                context.converter.resolveLinks(reflection.comment, reflection);
            }

            if (
                reflection instanceof DeclarationReflection &&
                reflection.readme
            ) {
                reflection.readme = context.converter.resolveLinks(
                    reflection.readme,
                    reflection
                );
            }
        }

        if (context.project.readme) {
            context.project.readme = context.converter.resolveLinks(
                context.project.readme,
                context.project
            );
        }
    }
}
