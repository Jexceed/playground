import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {VisualGlyph,visualMetaFor,visualParts} from '../../src/components/VisualToken';
export const renderGlyph = (kind:string) => renderToStaticMarkup(<VisualGlyph kind={kind}/>);
export {visualMetaFor,visualParts};
