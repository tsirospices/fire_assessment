require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WFSLayer",
    "esri/layers/ogc/wfsUtils",
    "esri/widgets/Legend",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
    "esri/layers/GeoJSONLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/widgets/ScaleBar",
    "esri/widgets/Measurement",
    "esri/widgets/Expand",
    "esri/widgets/Popup",
    "esri/widgets/BasemapGallery"
  ], function (Map, MapView, WFSLayer, wfsUtils, Legend, supabase,GeoJSONLayer, SimpleRenderer, SimpleFillSymbol, ScaleBar,Measurement, Expand, Popup,BasemapGallery) {

    //inputs the fire 
    const wfsLayer = new WFSLayer({
        //url: "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Northern_and_Central_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_snpp_24hrs&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv", // url to your WFS endpoint
        url : "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Southern_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_snpp_24hrs&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv",
        name: "fires_snpp_24hrs" // name of the FeatureType
      });
      //map.add(); // add the layer to the map
    
    const seven_days = new WFSLayer({
        url : "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Southern_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_snpp_7days&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv",
        name : "fires_snpp_7days"
    });

    const modis_24hr = new WFSLayer({
        url : "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Southern_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_modis_24hrs&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv",
        name : "fires_modis_24hrs"
    });

    const modis_7d = new WFSLayer({
        url : "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Southern_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_modis_7days&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv",
        name : "fires_modis_7days"
    })
    // Filter by date: Include only records from November 2024
    /*
    const startDate = "2024-09-01T00:00:00";
    const endDate = "2024-11-30T23:59:59";
    wfsLayer.definitionExpression = `
      datetime >= DATE '${startDate}' AND datetime <= DATE '${endDate}'
    `;
    */
     // Add custom symbology (renderer)
     modis_24hr.renderer = {
        type: "simple",
        symbol: {
        type: "simple-marker", // Applies to point data
        color: "orange",
        size: 10,
        outline: {
            color: "black",
            width: 1
        }
        }
    };

    modis_7d.renderer = {
        type: "simple",
        symbol: {
        type: "simple-marker", // Applies to point data
        color: "yellow",
        size: 10,
        outline: {
            color: "black",
            width: 1
        }
        }
    };

    wfsLayer.renderer = {
        type: "simple",
        symbol: {
        type: "simple-marker", // Applies to point data
        color: "red",
        size: 8,
        outline: {
            color: "white",
            width: 1
        }
        }
    };

    seven_days.renderer = {
        type: "simple",
        symbol: {
        type: "simple-marker", // Applies to point data
        color: "orange",
        size: 10,
        outline: {
            color: "white",
            width: 1
        }
        }
    };
  
    // Create map and view
    const map = new Map({
      basemap: "topo-vector",
      layers: [wfsLayer, seven_days, modis_24hr, modis_7d]
    });
  
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [47.93362,-21.65204], // ovaina Ambodimarohita 47.93362,-21.65204
      zoom: 13
    });

    const view_ = new MapView({
        container: "viewDiv_",
        map: map,
        center: [47.55729,-21.20932], // ovaina ambodivohangy 47.55729,-21.20932
        zoom: 13
      });

    

    let geojsonUrl = "./assets/tsiro_pa_.geojson";

    var renderer = new SimpleRenderer({
        symbol: new SimpleFillSymbol({
          color: [0, 255, 0, 0.5], // Green with 50% opacity
          outline: {
            color: [0, 0, 0, 1], // Black outline
            width: 1
          }
        })
      });
    
    var geojsonLayer = new GeoJSONLayer({
        url: geojsonUrl,
        renderer: renderer, 
        popupTemplate: {
            title: "{Nom_Prenom}", // Assurez-vous que ce champ existe dans votre GeoJSON
            //content: "{ID_number}",
            //content: "{trees}",
            content : [
                {
                    type: "fields",
                    fieldInfos: [
                      {
                        fieldName: 'id',
                        label: "id_number"
                      }
                    ]
                  },
            {
                type: "fields",
                fieldInfos: [
                {
                    fieldName: 'Parcel_TYP',
                    label: "Zonage"
                }
                ]
            },
            {
                type: "fields",
                fieldInfos: [
                    {
                    fieldName: 'ADM3_EN',
                    label: "Commune"
                    }
                ]
                }
         ]}});
    map.add(geojsonLayer);
        // Optionnel : Configurer les options du popup
    view.popup = new Popup({
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: true,
          breakpoint: false
        }
      });
    
    view_.popup = new Popup({
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: true,
          breakpoint: false
        }
      });
    //LEGENDE ET SCALE BARE
    const legend = new Expand({
        content: new Legend({
          view: view,
          //container : "legendDiv",
          style: "classic" // other styles include 'classic'
        }),
        view: view,
        expanded: true,
        autoCollapse : true
      });

    // Add the legend to the bottom-right corner of the view
     view.ui.add(legend, "top-right");

    const scaleBar = new ScaleBar({
        view: view,
        unit: "dual" // Options: "metric", "non-metric", "dual"
      });
      view.ui.add(scaleBar, {
        position: "bottom-left" // Position on the map
      });

      const legend_ = new Expand({
        content: new Legend({
          view: view_,
          //container : "legendDiv",
          style: "classic" // other styles include 'classic'
        }),
        view: view_,
        expanded: true,
        autoCollapse : true
      });

    // Add the legend to the bottom-right corner of the view
     view_.ui.add(legend_, "top-right");

    const scaleBar_ = new ScaleBar({
        view: view_,
        unit: "dual" // Options: "metric", "non-metric", "dual"
      });
      view_.ui.add(scaleBar_, {
        position: "bottom-left" // Position on the map
      });
    
    //basemap
    const basemapGallery = new Expand({
        content : new BasemapGallery({
            view: view,
            container: document.createElement("div")
          })
    });

    const basemapGallery_ = new Expand({
        content : new BasemapGallery({
            view: view_,
            container: document.createElement("div")
          })
    });
    /*
    const basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement("div")
      });
    */
      
      // Add the widget to the top-right corner of the view
      view.ui.add(basemapGallery, {
        position: "bottom-right"
      });
    
      view_.ui.add(basemapGallery_, {
        position: "bottom-right"
      });
    
  });