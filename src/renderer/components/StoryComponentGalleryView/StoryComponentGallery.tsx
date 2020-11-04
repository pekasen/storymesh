import { FunctionComponent, h } from 'preact';
// import "./StoryComponentGallery.css";

export const Gallery: FunctionComponent = ({ children }) => (
    <ul class="gallery-container list-group">{children}</ul>
);

export const StoryComponentGallery: FunctionComponent = ({ children }) => (
    <div class="verticalPaneGroup">
        <Gallery>
            {children}
        </Gallery>
    </div>
)
