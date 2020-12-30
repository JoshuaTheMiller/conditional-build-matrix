# Filter Matrix

Enables easier *conditional* matrix builds!

## Usage

```yml
name: Conditional Matrix Build

on: push

jobs:
  matrix_prep:
    runs-on: ubuntu-latest
    outputs:
      matrixIncludes: ${{ steps.set-matrixIncludes.outputs.matrixIncludes }}
    steps:
      # Required as the JSON input file needs to be read
      - uses: actions/checkout@v2      
      - id: set-matrixIncludes
        uses: JoshuaTheMiller/conditional-matrix        
        with:
          # inputFile: 'matrix_includes.json' # Default input file path
          filter: '[?runOnBranch==`${{ github.ref }}` || runOnBranch==`always`]'   
  build:
    needs: matrix_prep
    strategy:      
      matrix: ${{fromJson(needs.matrix_prep.outputs.matrixIncludes)}}
    name: Build
    runs-on: ${{ matrix.runs_on }}
    steps:
    - name: Echo
      run: echo "${{ matrix.runOn }}"

```

### Filtering on Branch Name

The following workflow sample uses the `nelonoel/branch-name` Action so that the branch name itself can be used in the filter:

```yml
name: Conditional Matrix Build

on: push

jobs:
  matrix_prep:
    runs-on: ubuntu-latest
    outputs:
      matrixIncludes: ${{ steps.set-matrixIncludes.outputs.matrixIncludes }}
    steps:
      - uses: actions/checkout@v2
      - uses: nelonoel/branch-name@v1.0.1
      - id: set-matrixIncludes
        uses: JoshuaTheMiller/conditional-matrix        
        with:          
          filter: '[?runOnBranch==`${{ env.BRANCH_NAME }}` || runOnBranch==`always`]'   
  build:
    needs: matrix_prep
    strategy:      
      matrix: ${{fromJson(needs.matrix_prep.outputs.matrixIncludes)}}
    name: Build
    runs-on: ${{ matrix.runs_on }}
    steps:
    - name: Echo
      run: echo "${{ matrix.runOn }}"

```

## Tips

### Necessary JSON File

This Action requires a JSON file that contains the information you would normally include in a `strategy.matrix.includes` block (example is [included below](#sample-json-file)). By default, the action will look for a top level file named `matrix_includes.json`. If you want to name the file differently, or place it in a different folder, set the path via the `inputFile` input.

#### Sample JSON File

The following is the sample file (`matrix_includes.json`) that was used in the workflow above.

```json
[
    {
        "runs_on":"ubuntu-latest",        
        "runOnBranch":"always"
    },
    {
        "runs_on":"windows-latest",        
        "runOnBranch":"main"
    }
]
```

### JSON File Placement

For a cleaner repository, I recommend placing the `matrix_includes.json` file in your `.github/workflows/` folder. Doing so will also help communicate the purpose of the file. Following this advice would require one to set the `inputFile` input value so that this Action knows where the JSON file is.