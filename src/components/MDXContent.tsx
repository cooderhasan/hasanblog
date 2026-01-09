'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

interface MDXContentProps {
    source: MDXRemoteSerializeResult;
}

// Custom components for MDX
const components = {
    h1: (props: any) => (
        <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />
    ),
    h2: (props: any) => (
        <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8" {...props} />
    ),
    h3: (props: any) => (
        <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6" {...props} />
    ),
    h4: (props: any) => (
        <h4 className="text-xl font-bold text-gray-900 mb-2 mt-4" {...props} />
    ),
    p: (props: any) => (
        <p className="text-gray-700 leading-relaxed mb-4" {...props} />
    ),
    ul: (props: any) => (
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2" {...props} />
    ),
    ol: (props: any) => (
        <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2" {...props} />
    ),
    li: (props: any) => (
        <li className="ml-4" {...props} />
    ),
    a: (props: any) => (
        <a className="text-blue-600 hover:text-blue-700 underline" {...props} />
    ),
    blockquote: (props: any) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4" {...props} />
    ),
    code: (props: any) => (
        <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm" {...props} />
    ),
    pre: (props: any) => (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
    ),
    img: (props: any) => (
        <img className="rounded-lg my-6 w-full" {...props} />
    ),
    hr: (props: any) => (
        <hr className="my-8 border-gray-300" {...props} />
    ),
    table: (props: any) => (
        <div className="overflow-x-auto my-6">
            <table className="min-w-full divide-y divide-gray-300" {...props} />
        </div>
    ),
    th: (props: any) => (
        <th className="px-4 py-2 bg-gray-100 text-left text-sm font-semibold text-gray-900" {...props} />
    ),
    td: (props: any) => (
        <td className="px-4 py-2 text-sm text-gray-700" {...props} />
    ),
};

export default function MDXContent({ source }: MDXContentProps) {
    return (
        <div className="prose prose-lg max-w-none">
            <MDXRemote {...source} components={components} />
        </div>
    );
}
