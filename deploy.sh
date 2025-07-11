#!/bin/bash
echo "🚀 Building DentalCare Application..."
npm run build

echo "✅ Build completed successfully!"
echo "📦 The build is ready for deployment in the 'build' folder"
echo ""
echo "🌐 Deploy to platforms:"
echo "  - Vercel: npx vercel --prod"
echo "  - Netlify: Drag and drop 'build' folder to netlify.com/drop"
echo "  - GitHub Pages: Push to gh-pages branch"
echo ""
echo "🔗 Local preview:"
echo "  - npx serve -s build"
echo "  - Open http://localhost:3000"
