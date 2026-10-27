/*************************************************
 * NEIGHBORSOURCE PRIVATE ADMIN DASHBOARD
 *
 * This is the PRIVATE admin Apps Script project.
 * Do not put this code in the public API project.
 *************************************************/


/*************************************************
 * DATABASE
 *************************************************/

const ADMIN_SPREADSHEET_ID =
  '1IvyBNiE-7Aazd21q4_Wsug5WPVo3uqoLHPLZrO4Fqdg';


/*************************************************
 * ADMIN SECTIONS
 *************************************************/

const ADMIN_SECTIONS = {

  providers: {
    title: 'Providers',
    sheetName: 'Providers',
    idHeaders: [
      'ID'
    ],
    allowedStatuses: [
      'Pending',
      'Approved',
      'Rejected',
      'Removed'
    ],
    approvalDateHeaders: [
      'Date Approved'
    ],
    reviewDateHeaders: [],
    notesHeaders: [],
    supportsNotes: false
  },


  recommendations: {
    title: 'Recommendations',
    sheetName: 'Recommendations',
    idHeaders: [
      'Recommendation ID'
    ],
    allowedStatuses: [
      'Pending',
      'Approved',
      'Rejected'
    ],
    approvalDateHeaders: [
      'Date Approved'
    ],
    reviewDateHeaders: [],
    notesHeaders: [],
    supportsNotes: false
  },


  serviceRequests: {
    title: 'Service Requests',
    sheetName: 'Service Requests',
    idHeaders: [
      'Request ID',
      'Required ID'
    ],
    allowedStatuses: [
      'Pending',
      'Reviewed',
      'Closed'
    ],
    approvalDateHeaders: [],
    reviewDateHeaders: [],
    notesHeaders: [],
    supportsNotes: false
  },


  providerSuggestions: {
    title: 'Provider Suggestions',
    sheetName: 'Provider Suggestions',
    idHeaders: [
      'Suggestion ID'
    ],
    allowedStatuses: [
      'Pending',
      'Approved',
      'Rejected'
    ],
    approvalDateHeaders: [],
    reviewDateHeaders: [
      'Date Reviewed'
    ],
    notesHeaders: [],
    supportsNotes: false
  },


  listingUpdates: {
    title: 'Listing Updates',
    sheetName: 'Listing Updates',
    idHeaders: [
      'Update ID'
    ],
    allowedStatuses: [
      'Pending',
      'Completed',
      'Rejected'
    ],
    approvalDateHeaders: [],
    reviewDateHeaders: [
      'Date Reviewed'
    ],
    notesHeaders: [
      'Admin Notes'
    ],
    supportsNotes: true
  },


  reports: {
    title: 'Reports',
    sheetName: 'Reports',
    idHeaders: [
      'Report ID'
    ],
    allowedStatuses: [
      'Pending',
      'Reviewed',
      'Resolved',
      'Dismissed'
    ],
    approvalDateHeaders: [],
    reviewDateHeaders: [
      'Date Reviewed'
    ],
    notesHeaders: [
      'Admin Notes'
    ],
    supportsNotes: true
  },


  contactMessages: {
    title: 'Contact Messages',
    sheetName: 'Contact Messages',
    idHeaders: [
      'Message ID'
    ],
    allowedStatuses: [
      'Pending',
      'Reviewed',
      'Closed'
    ],
    approvalDateHeaders: [],
    reviewDateHeaders: [
      'Date Reviewed'
    ],
    notesHeaders: [
      'Admin Notes'
    ],
    supportsNotes: true
  }

};


/*************************************************
 * WEB APP
 *************************************************/

function doGet() {

  return HtmlService
    .createHtmlOutputFromFile(
      'Admin'
    )
    .setTitle(
      'NeighborSource Admin'
    );

}


/*************************************************
 * GET FULL DASHBOARD
 *************************************************/

function getAdminDashboardData() {

  const spreadsheet =
    SpreadsheetApp.openById(
      ADMIN_SPREADSHEET_ID
    );


  const sections = [];

  let totalPending = 0;


  Object.keys(
    ADMIN_SECTIONS
  ).forEach(
    key => {

      const config =
        ADMIN_SECTIONS[
          key
        ];


      const section =
        getAdminSectionData_(
          spreadsheet,
          key,
          config
        );


      totalPending +=
        section.pendingCount;


      sections.push(
        section
      );

    }
  );


  const directoryStats =
    getDirectoryStats_(
      spreadsheet
    );


  return {

    success: true,

    generatedAt:
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        'MMM d, yyyy h:mm a'
      ),

    totalPending:
      totalPending,

    directoryStats:
      directoryStats,

    sections:
      sections

  };

}


/*************************************************
 * DIRECTORY STATISTICS
 *
 * These statistics use APPROVED providers so
 * they reflect listings actually visible in the
 * public NeighborSource directory.
 *************************************************/

function getDirectoryStats_(
  spreadsheet
) {

  const providerSheet =
    spreadsheet.getSheetByName(
      'Providers'
    );


  const recommendationSheet =
    spreadsheet.getSheetByName(
      'Recommendations'
    );


  const result = {

    totalProviderRecords: 0,

    approvedProviders: 0,

    pendingProviders: 0,

    businesses: 0,

    individuals: 0,

    approvedRecommendations: 0,

    categories: [],

    cities: []

  };


  /***********************************************
   * PROVIDERS
   ***********************************************/

  if (
    providerSheet
  ) {

    const values =
      providerSheet
        .getDataRange()
        .getDisplayValues();


    if (
      values.length >
      1
    ) {

      const headers =
        values[
          0
        ];


      const statusIndex =
        findHeaderIndex_(
          headers,
          [
            'Status'
          ]
        );


      const typeIndex =
        findHeaderIndex_(
          headers,
          [
            'Provider Type'
          ]
        );


      const categoryIndex =
        findHeaderIndex_(
          headers,
          [
            'Category'
          ]
        );


      const serviceAreaIndex =
        findHeaderIndex_(
          headers,
          [
            'Service Area'
          ]
        );


      const categoryCounts = {};

      const cityCounts = {};


      for (
        let i = 1;
        i < values.length;
        i++
      ) {

        const row =
          values[
            i
          ];


        const hasContent =
          row.some(
            value =>
              String(
                value ||
                ''
              ).trim() !==
              ''
          );


        if (
          !hasContent
        ) {

          continue;

        }


        result.totalProviderRecords++;


        const status =
          statusIndex >=
          0
            ?
              String(
                row[
                  statusIndex
                ] ||
                ''
              )
                .trim()
                .toLowerCase()
            :
              '';


        if (
          status ===
          'pending'
        ) {

          result.pendingProviders++;

        }


        if (
          status !==
          'approved'
        ) {

          continue;

        }


        result.approvedProviders++;


        /*******************************************
         * PROVIDER TYPE
         *******************************************/

        if (
          typeIndex >=
          0
        ) {

          const providerType =
            String(
              row[
                typeIndex
              ] ||
              ''
            )
              .trim()
              .toLowerCase();


          if (
            providerType ===
            'business'
          ) {

            result.businesses++;

          }


          if (
            providerType ===
            'individual'
          ) {

            result.individuals++;

          }

        }


        /*******************************************
         * CATEGORY
         *******************************************/

        if (
          categoryIndex >=
          0
        ) {

          const category =
            String(
              row[
                categoryIndex
              ] ||
              ''
            ).trim();


          if (
            category
          ) {

            categoryCounts[
              category
            ] =
              (
                categoryCounts[
                  category
                ] ||
                0
              ) +
              1;

          }

        }


        /*******************************************
         * SERVICE AREA / CITY
         *******************************************/

        if (
          serviceAreaIndex >=
          0
        ) {

          const serviceArea =
            String(
              row[
                serviceAreaIndex
              ] ||
              ''
            ).trim();


          if (
            serviceArea
          ) {

            const cities =
              serviceArea
                .split(
                  /[,;|]+/
                )
                .map(
                  city =>
                    city.trim()
                )
                .filter(
                  city =>
                    city
                );


            const uniqueCities =
              [
                ...new Set(
                  cities
                )
              ];


            uniqueCities.forEach(
              city => {

                cityCounts[
                  city
                ] =
                  (
                    cityCounts[
                      city
                    ] ||
                    0
                  ) +
                  1;

              }
            );

          }

        }

      }


      result.categories =
        objectCountsToArray_(
          categoryCounts
        );


      result.cities =
        objectCountsToArray_(
          cityCounts
        );

    }

  }


  /***********************************************
   * APPROVED RECOMMENDATIONS
   ***********************************************/

  if (
    recommendationSheet
  ) {

    const values =
      recommendationSheet
        .getDataRange()
        .getDisplayValues();


    if (
      values.length >
      1
    ) {

      const headers =
        values[
          0
        ];


      const statusIndex =
        findHeaderIndex_(
          headers,
          [
            'Status'
          ]
        );


      if (
        statusIndex >=
        0
      ) {

        for (
          let i = 1;
          i < values.length;
          i++
        ) {

          const status =
            String(
              values[
                i
              ][
                statusIndex
              ] ||
              ''
            )
              .trim()
              .toLowerCase();


          if (
            status ===
            'approved'
          ) {

            result.approvedRecommendations++;

          }

        }

      }

    }

  }


  return result;

}


/*************************************************
 * CONVERT COUNT OBJECT TO SORTED ARRAY
 *************************************************/

function objectCountsToArray_(
  counts
) {

  return Object
    .keys(
      counts
    )
    .map(
      name => ({
        name:
          name,
        count:
          counts[
            name
          ]
      })
    )
    .sort(
      (
        a,
        b
      ) => {

        if (
          b.count !==
          a.count
        ) {

          return (
            b.count -
            a.count
          );

        }


        return a.name.localeCompare(
          b.name
        );

      }
    );

}


/*************************************************
 * GET ONE ADMIN SECTION
 *************************************************/

function getAdminSectionData_(
  spreadsheet,
  key,
  config
) {

  const sheet =
    spreadsheet.getSheetByName(
      config.sheetName
    );


  if (
    !sheet
  ) {

    return {

      key:
        key,

      title:
        config.title,

      error:
        'Sheet not found: ' +
        config.sheetName,

      pendingCount: 0,

      totalCount: 0,

      counts: {},

      allowedStatuses:
        config.allowedStatuses,

      supportsNotes:
        config.supportsNotes,

      rows: []

    };

  }


  const values =
    sheet
      .getDataRange()
      .getDisplayValues();


  if (
    values.length ===
    0
  ) {

    return {

      key:
        key,

      title:
        config.title,

      pendingCount: 0,

      totalCount: 0,

      counts: {},

      allowedStatuses:
        config.allowedStatuses,

      supportsNotes:
        config.supportsNotes,

      rows: []

    };

  }


  const headers =
    values[
      0
    ];


  let idIndex =
    findHeaderIndex_(
      headers,
      config.idHeaders
    );


  if (
    idIndex ===
    -1
  ) {

    idIndex = 0;

  }


  const statusIndex =
    findHeaderIndex_(
      headers,
      [
        'Status'
      ]
    );


  const rows = [];

  const counts = {};


  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    const row =
      values[
        i
      ];


    const hasContent =
      row.some(
        value =>
          String(
            value ||
            ''
          ).trim() !==
          ''
      );


    if (
      !hasContent
    ) {

      continue;

    }


    const recordId =
      String(
        row[
          idIndex
        ] ||
        ''
      ).trim();


    const status =
      statusIndex >=
      0
        ?
          String(
            row[
              statusIndex
            ] ||
            ''
          ).trim()
        :
          '';


    const normalizedStatus =
      status ||
      'No Status';


    counts[
      normalizedStatus
    ] =
      (
        counts[
          normalizedStatus
        ] ||
        0
      ) +
      1;


    const fields = [];


    headers.forEach(
      (
        header,
        columnIndex
      ) => {

        const label =
          String(
            header ||
            ''
          ).trim();


        const value =
          String(
            row[
              columnIndex
            ] ||
            ''
          ).trim();


        if (
          !label ||
          !value
        ) {

          return;

        }


        fields.push({

          label:
            label,

          value:
            value

        });

      }
    );


    rows.push({

      recordId:
        recordId,

      status:
        status,

      rowNumber:
        i + 1,

      fields:
        fields

    });

  }


  rows.sort(
    (
      a,
      b
    ) =>
      b.rowNumber -
      a.rowNumber
  );


  const pendingCount =
    rows.filter(
      row =>
        String(
          row.status ||
          ''
        )
          .trim()
          .toLowerCase() ===
        'pending'
    ).length;


  return {

    key:
      key,

    title:
      config.title,

    pendingCount:
      pendingCount,

    totalCount:
      rows.length,

    counts:
      counts,

    allowedStatuses:
      config.allowedStatuses,

    supportsNotes:
      config.supportsNotes,

    rows:
      rows

  };

}


/*************************************************
 * UPDATE RECORD
 *************************************************/

function updateAdminRecord(
  sectionKey,
  recordId,
  newStatus,
  adminNotes
) {

  const key =
    String(
      sectionKey ||
      ''
    ).trim();


  const id =
    String(
      recordId ||
      ''
    ).trim();


  const status =
    String(
      newStatus ||
      ''
    ).trim();


  const notes =
    String(
      adminNotes ||
      ''
    ).trim();


  const config =
    ADMIN_SECTIONS[
      key
    ];


  if (
    !config
  ) {

    throw new Error(
      'Unknown admin section.'
    );

  }


  if (
    !id
  ) {

    throw new Error(
      'Record ID is missing.'
    );

  }


  if (
    !config.allowedStatuses.includes(
      status
    )
  ) {

    throw new Error(
      'Invalid status.'
    );

  }


  const spreadsheet =
    SpreadsheetApp.openById(
      ADMIN_SPREADSHEET_ID
    );


  const sheet =
    spreadsheet.getSheetByName(
      config.sheetName
    );


  if (
    !sheet
  ) {

    throw new Error(
      'Sheet not found: ' +
      config.sheetName
    );

  }


  const values =
    sheet
      .getDataRange()
      .getDisplayValues();


  if (
    values.length <
    2
  ) {

    throw new Error(
      'No records found.'
    );

  }


  const headers =
    values[
      0
    ];


  let idIndex =
    findHeaderIndex_(
      headers,
      config.idHeaders
    );


  if (
    idIndex ===
    -1
  ) {

    idIndex = 0;

  }


  const statusIndex =
    findHeaderIndex_(
      headers,
      [
        'Status'
      ]
    );


  if (
    statusIndex ===
    -1
  ) {

    throw new Error(
      'Status column not found.'
    );

  }


  let matchedRowNumber =
    -1;


  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    const currentId =
      String(
        values[
          i
        ][
          idIndex
        ] ||
        ''
      ).trim();


    if (
      currentId ===
      id
    ) {

      matchedRowNumber =
        i + 1;

      break;

    }

  }


  if (
    matchedRowNumber ===
    -1
  ) {

    throw new Error(
      'Record not found.'
    );

  }


  /***********************************************
   * STATUS
   ***********************************************/

  sheet
    .getRange(
      matchedRowNumber,
      statusIndex + 1
    )
    .setValue(
      status
    );


  /***********************************************
   * DATE APPROVED
   ***********************************************/

  if (
    status ===
    'Approved'
  ) {

    setDateIfColumnExists_(
      sheet,
      headers,
      matchedRowNumber,
      config.approvalDateHeaders
    );

  }


  /***********************************************
   * DATE REVIEWED
   ***********************************************/

  if (
    status !==
    'Pending'
  ) {

    setDateIfColumnExists_(
      sheet,
      headers,
      matchedRowNumber,
      config.reviewDateHeaders
    );

  }


  /***********************************************
   * ADMIN NOTES
   ***********************************************/

  if (
    notes &&
    config.notesHeaders.length
  ) {

    const notesIndex =
      findHeaderIndex_(
        headers,
        config.notesHeaders
      );


    if (
      notesIndex >=
      0
    ) {

      sheet
        .getRange(
          matchedRowNumber,
          notesIndex + 1
        )
        .setValue(
          notes
        );

    }

  }


  SpreadsheetApp.flush();


  /***********************************************
   * RECOMMENDATION COUNT
   ***********************************************/

  if (
    key ===
    'recommendations'
  ) {

    syncProviderRecommendationCount_(
      sheet,
      matchedRowNumber,
      headers
    );

  }


  return getAdminDashboardData();

}


/*************************************************
 * SET DATE IF COLUMN EXISTS
 *************************************************/

function setDateIfColumnExists_(
  sheet,
  headers,
  rowNumber,
  possibleHeaders
) {

  if (
    !possibleHeaders ||
    !possibleHeaders.length
  ) {

    return;

  }


  const index =
    findHeaderIndex_(
      headers,
      possibleHeaders
    );


  if (
    index <
    0
  ) {

    return;

  }


  sheet
    .getRange(
      rowNumber,
      index + 1
    )
    .setValue(
      new Date()
    );

}


/*************************************************
 * SYNC PROVIDER RECOMMENDATION COUNT
 *************************************************/

function syncProviderRecommendationCount_(
  recommendationSheet,
  recommendationRowNumber,
  recommendationHeaders
) {

  const providerIdIndex =
    findHeaderIndex_(
      recommendationHeaders,
      [
        'Provider ID'
      ]
    );


  if (
    providerIdIndex <
    0
  ) {

    return;

  }


  const providerId =
    String(
      recommendationSheet
        .getRange(
          recommendationRowNumber,
          providerIdIndex + 1
        )
        .getDisplayValue() ||
      ''
    ).trim();


  if (
    !providerId
  ) {

    return;

  }


  const spreadsheet =
    SpreadsheetApp.openById(
      ADMIN_SPREADSHEET_ID
    );


  const recommendations =
    spreadsheet.getSheetByName(
      'Recommendations'
    );


  const providers =
    spreadsheet.getSheetByName(
      'Providers'
    );


  if (
    !recommendations ||
    !providers
  ) {

    return;

  }


  const recommendationValues =
    recommendations
      .getDataRange()
      .getDisplayValues();


  if (
    recommendationValues.length <
    2
  ) {

    return;

  }


  const recHeaders =
    recommendationValues[
      0
    ];


  const recProviderIndex =
    findHeaderIndex_(
      recHeaders,
      [
        'Provider ID'
      ]
    );


  const recStatusIndex =
    findHeaderIndex_(
      recHeaders,
      [
        'Status'
      ]
    );


  if (
    recProviderIndex <
      0 ||
    recStatusIndex <
      0
  ) {

    return;

  }


  let approvedCount =
    0;


  for (
    let i = 1;
    i < recommendationValues.length;
    i++
  ) {

    const row =
      recommendationValues[
        i
      ];


    const currentProviderId =
      String(
        row[
          recProviderIndex
        ] ||
        ''
      ).trim();


    const currentStatus =
      String(
        row[
          recStatusIndex
        ] ||
        ''
      )
        .trim()
        .toLowerCase();


    if (
      currentProviderId ===
        providerId &&
      currentStatus ===
        'approved'
    ) {

      approvedCount++;

    }

  }


  const providerValues =
    providers
      .getDataRange()
      .getDisplayValues();


  if (
    providerValues.length <
    2
  ) {

    return;

  }


  const providerHeaders =
    providerValues[
      0
    ];


  const providerIdIndex2 =
    findHeaderIndex_(
      providerHeaders,
      [
        'ID'
      ]
    );


  const recommendationCountIndex =
    findHeaderIndex_(
      providerHeaders,
      [
        'Recommendation Count',
        'Recommendations',
        'Recommendations / Recommendation Count'
      ]
    );


  if (
    providerIdIndex2 <
      0 ||
    recommendationCountIndex <
      0
  ) {

    return;

  }


  for (
    let i = 1;
    i < providerValues.length;
    i++
  ) {

    const currentId =
      String(
        providerValues[
          i
        ][
          providerIdIndex2
        ] ||
        ''
      ).trim();


    if (
      currentId ===
      providerId
    ) {

      providers
        .getRange(
          i + 1,
          recommendationCountIndex + 1
        )
        .setValue(
          approvedCount
        );

      break;

    }

  }


  SpreadsheetApp.flush();

}


/*************************************************
 * FIND HEADER INDEX
 *************************************************/

function findHeaderIndex_(
  headers,
  possibleHeaders
) {

  const normalizedHeaders =
    headers.map(
      header =>
        String(
          header ||
          ''
        )
          .trim()
          .toLowerCase()
    );


  for (
    const possibleHeader
    of possibleHeaders
  ) {

    const normalized =
      String(
        possibleHeader ||
        ''
      )
        .trim()
        .toLowerCase();


    const index =
      normalizedHeaders.indexOf(
        normalized
      );


    if (
      index !==
      -1
    ) {

      return index;

    }

  }


  return -1;

}
