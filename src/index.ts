import { PlugInPack } from "storygraph";
import { Container, ContainerPlugIn } from "./content/Container";
import { HotSpot, HotSpotPlugIn } from "./modifiers/HotSpot";
import { AudioObject, AudioPlugIn } from "./content/AudioObject";
import { Branch, BranchPlugIn } from "./content/Branch";
import { _HeroObject, HeroPlugIn } from "./content/HeroObject";
import { InputConnectorView, InputConnectorViewPlugIn } from "./content/InputConnectorView";
import { OutputConnectorView, OutputConnectorViewPlugIn } from "./content/OutputConnectorView";
import { _Spacer, SpacerPlugIn } from "./content/Spacer";
import { Story, StoryContainerPlugIn } from "./content/Story";
import { _TextObject, TextPlugIn } from "./content/TextObject";
import { VideoObject, VideoPlugIn } from "./content/VideoObject";
// import { AnimationModifier, AnimationPlugIn } from "./modifiers/Animation";
// import { FilterModifier, FilterPlugIn } from "./modifiers/Filter";
// import { CSSGridContainerModifier, CSSGridContainerModifierPlugIn } from "./modifiers/GridContainer";
// import { CSSGridItemModifier, CSSGriditemModifierPlugIn } from "./modifiers/GridItem";
// import { HTMLInteractionModifier, HTMLInteractionModifierPlugIn } from "./modifiers/InteractionModifier";
// import { TransitionModifier, TransitionModifierPlugIn } from "./modifiers/TransitionModifier";

const PlugInExports: PlugInPack = {
    name: "storymesh base",
    version: "1.0.0",
    publisher: {
        id: "storymesh",
        mail: "hello@storymesh.de",
        name: "StoryMesh"
    },
    baseURL: "https://www.storymesh.de/cdn/",
    __index: [
        ContainerPlugIn,
        HotSpotPlugIn,
        AudioPlugIn,
        BranchPlugIn,
        HeroPlugIn,
        InputConnectorViewPlugIn,
        OutputConnectorViewPlugIn,
        SpacerPlugIn,
        StoryContainerPlugIn,
        TextPlugIn,
        VideoPlugIn,
        // AnimationPlugIn,
        // FilterPlugIn,
        // CSSGridContainerModifierPlugIn,
        // CSSGriditemModifierPlugIn,
        // HTMLInteractionModifierPlugIn,
        // TransitionModifierPlugIn
    ]
}

export {
    PlugInExports,
    HotSpotPlugIn,
    ContainerPlugIn,
    AudioPlugIn,
    BranchPlugIn,
    HeroPlugIn,
    InputConnectorViewPlugIn,
    OutputConnectorViewPlugIn,
    SpacerPlugIn,
    StoryContainerPlugIn,
    TextPlugIn,
    VideoPlugIn,
    // AnimationPlugIn,
    // FilterPlugIn,
    // CSSGridContainerModifierPlugIn,
    // CSSGriditemModifierPlugIn,
    // HTMLInteractionModifierPlugIn,
    // TransitionModifierPlugIn,
    HotSpot,
    Container,
    AudioObject,
    Branch,
    _HeroObject,
    InputConnectorView,
    OutputConnectorView,
    _Spacer,
    Story,
    _TextObject,
    VideoObject,
    // AnimationModifier,
    // FilterModifier,
    // CSSGridContainerModifier,
    // CSSGridItemModifier,
    // HTMLInteractionModifier,
    // TransitionModifier
}
