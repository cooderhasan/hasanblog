import React from 'react';

/**
 * This component is never rendered but ensures Tailwind generates these classes.
 * Since the layout width is dynamic from the database, Tailwind scanner might miss it
 * if it doesn't see the full class string in the source code.
 */
export default function TailwindSafelist() {
    return (
        <div className="hidden">
            <div className="max-w-4xl"></div>
            <div className="max-w-5xl"></div>
            <div className="max-w-6xl"></div>
            <div className="max-w-7xl"></div>
            <div className="max-w-full"></div>
            <div className="container"></div>
        </div>
    );
}
