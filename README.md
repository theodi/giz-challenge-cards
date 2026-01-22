# Challenge Card Reference Lists

A dynamic web application for displaying reference lists for challenge cards. The application loads challenge data from CSV files and renders them dynamically using client-side JavaScript.

## Features

- **Dynamic Content Loading**: Loads challenge data from CSV files via AJAX
- **Category Grouping**: Automatically groups resources by category
- **Responsive Design**: Mobile-friendly navigation with hamburger menu
- **Multiple Challenges**: Supports 10 different challenges with dedicated navigation
- **CSV-based Data**: Easy to update by editing CSV files in the `link-lists/` directory

## Project Structure

```
/
├── index.html          # Main HTML file
├── app.js              # JavaScript for CSV parsing and dynamic rendering
├── styles.css          # Stylesheet with ODI branding
└── link-lists/         # CSV files containing challenge data
    ├── challenges.csv  # Master list of all challenges
    └── Challenge_*.csv # Individual challenge reference lists
```

## Files

- `index.html` - Main HTML template with navigation menu
- `app.js` - Client-side JavaScript for:
  - CSV parsing with proper quote handling
  - Dynamic content loading from CSV files
  - Category-based grouping of resources
  - URL parameter handling for challenge selection
- `styles.css` - Responsive stylesheet with ODI brand colors
- `link-lists/challenges.csv` - Master CSV file listing all challenges
- `link-lists/Challenge_*.csv` - Individual CSV files for each challenge's reference list

## CSV Format

### challenges.csv
```csv
challenge,title
1,"Data governance and legal uncertainty"
2,"Lack of in-house data/AI skills"
...
```

### Challenge CSV files (Challenge_1.csv, etc.)
Each challenge CSV should have the following columns:
- `title` - Resource title
- `url` - Resource URL
- `description` - Resource description (optional)
- `category` - Category for grouping (optional)

## Usage

1. **View All Challenges**: Navigate to the root URL to see a list of all challenges
2. **View Specific Challenge**: Use `?challenge=N` in the URL (e.g., `?challenge=1`)
3. **Update Content**: Edit the CSV files in `link-lists/` to update reference lists
4. **Add New Challenges**: 
   - Add entry to `challenges.csv`
   - Create corresponding `Challenge_N.csv` file

## Brand Colors

- **ODI Blue Dark**: #072589 (primary brand color, header background)
- **ODI Cyan**: #6df8ff (accent color)
- **Black**: #000000 (text)
- **Gray**: #333333, #666666 (secondary text)
- **Gray Border**: #e2e6e9 (borders)
- **Gray Lighter**: #F5F5F5 (light backgrounds)
- **White**: #FFFFFF (background)

## Challenges

The application includes 10 challenges:

1. Data governance and legal uncertainty
2. Lack of in-house data/AI skills
3. Limited data quality
4. Organisational development gaps (maturity)
5. Lack of data availability
6. Using data and AI in political decision-making
7. Applying AI tools in administration
8. Improving data quality and availability
9. Developing internal data and AI strategies
10. Collaboration between technical users and policy experts

## Technical Details

- **Pure JavaScript**: No dependencies or build process required
- **Client-side Rendering**: All content is loaded and rendered dynamically
- **CSV Parsing**: Custom parser handles quoted fields and escaped quotes
- **Responsive Navigation**: Mobile hamburger menu with accessibility features
- **URL-based Navigation**: Challenge selection via query parameters
