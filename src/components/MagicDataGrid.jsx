import React from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic


const MagicDataGrid = ({innerRef, gridStyle, columnDefs, rowData, pagination, rowSelection, onRowSelected, isRowSelectable}) => {
    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 100,
    };

    const modifiedColumnDefs = columnDefs.map(function(columnDef) {
        columnDef['suppressMovable'] = columnDef['suppressMovable'] ?? true;
        columnDef['autoHeight'] = columnDef['autoHeight'] ?? true;

        // default class set if not set
        if(!columnDef['cellClass'])
        {
            if(columnDef['checkboxSelection'])
            {
                columnDef['cellClass'] = 'magic-grid-checkbox-cell';

                // Checkbox column needs to be wide enough
                columnDef['minWidth'] = 150;
            }
            else
            {
                columnDef['cellClass'] = 'magic-grid-norm-cell';
            }
        }

        if(columnDef['isArray'])
        {
            columnDef['valueFormatter'] = (params) => {
                if (params.value)
                {
                  return params.value.join(', ');
                }
  
                return;
            };

            delete columnDef['isArray'];
        }

        if(columnDef['textFilter'])
        {
            columnDef['filter'] = 'agTextColumnFilter';
            columnDef['filterParams'] =  {
                filterOptions: ['contains'],
                maxNumConditions: 1,
                debounceMs: 200,
                buttons: ['reset'],
            };

            columnDef['floatingFilter'] = true;
            columnDef['suppressMenu'] = true;
            columnDef['floatingFilterComponentParams'] = {
                suppressFilterButton: true,
            };

            delete columnDef['textFilter'];
        }

        if(columnDef['booleanFilter'])
        {
            columnDef['filter'] = 'agTextColumnFilter';
            columnDef['filterParams'] =  {
                filterOptions: [
                    'empty',
                    {
                        displayKey: 'yes',
                        displayName: 'Yes',
                        predicate: (_, cellValue) => cellValue != null && cellValue === 'Yes',
                        numberOfInputs: 0,
                    },
                    {
                        displayKey: 'no',
                        displayName: 'No',
                        predicate: (_, cellValue) => cellValue != null && cellValue === 'No',
                        numberOfInputs: 0,
                    },
                ],
                maxNumConditions: 1,
                debounceMs: 200,
                buttons: ['reset'],
            };

            columnDef['floatingFilter'] = true;
            columnDef['suppressMenu'] = true;

            if(!columnDef.width)
            {
                columnDef['width'] = 100;
            }

            delete columnDef['booleanFilter'];
        }

        if(columnDef['sexFilter'])
        {
            columnDef['filter'] = 'agTextColumnFilter';
            columnDef['filterParams'] =  {
                filterOptions: [
                    'empty',
                    {
                        displayKey: 'f',
                        displayName: 'F',
                        predicate: (_, cellValue) => cellValue != null && cellValue === 'F',
                        numberOfInputs: 0,
                    },
                    {
                        displayKey: 'm',
                        displayName: 'M',
                        predicate: (_, cellValue) => cellValue != null && cellValue === 'M',
                        numberOfInputs: 0,
                    },
                ],
                maxNumConditions: 1,
                debounceMs: 200,
                buttons: ['reset'],
            };

            columnDef['floatingFilter'] = true;
            columnDef['suppressMenu'] = true;

            if(!columnDef.width)
            {
                columnDef['width'] = 100;
            }

            delete columnDef['sexFilter'];
        }

        if(columnDef['dateFilter'])
        {
            columnDef['filter'] = 'agDateColumnFilter';
            columnDef['filterParams'] =  {
                filterOptions: ['equals', 'inRange'],
                maxNumConditions: 1,
                inRangeInclusive: true,
                buttons: ['reset', 'apply'],
            };
            columnDef['floatingFilter'] = true;
            columnDef['suppressMenu'] = true;

            delete columnDef['dateFilter'];
        }

        columnDef['cellStyle'] = {'wordBreak': 'break-word'};

        return columnDef;
    });

    const onGridReady = (params) => {
      // Auto-size all columns after the grid is ready
      params.api.autoSizeAllColumns();
    };

    const onFirstDataRendered = (params) => {
        const nodesToSelect = [];

        params.api.forEachNode((node) => {
            if (node.data && node.data.rowSelected) {
                nodesToSelect.push(node);
            }
        });

        params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });

        if (onRowSelected)
        {
            params.api.addEventListener('rowSelected', onRowSelected);
        }
    }

    const paginationPageSizeSelector = [30, 60, 90, 120, 10000];
    const paginationPageSize = paginationPageSizeSelector[0];


    //const paginationPageSize = 2;
    //const paginationPageSizeSelector = [2, 3];
  
    return (
        <div>
            <div className="ag-theme-quartz" style={gridStyle}>
                <AgGridReact
                    ref={innerRef}
                    columnDefs={modifiedColumnDefs}
                    rowData={rowData}
                    onGridReady={onGridReady}
                    autoSizeStrategy={autoSizeStrategy}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    onFirstDataRendered={onFirstDataRendered}
                    rowSelection={rowSelection}
                    suppressRowClickSelection={true}
                    suppressCellFocus={true}
                    isRowSelectable={isRowSelectable}
                />
            </div>
        </div>
    );
};

export default MagicDataGrid;