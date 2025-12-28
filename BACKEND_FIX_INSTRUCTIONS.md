# Backend Fix for GeoJSON Map Display

## Problem
The Provincia entity has geometry data but it's marked with @JsonIgnore, so it's not sent to the frontend.

## Solution: Create a GeoJSON Response

### Step 1: Create a DTO for GeoJSON Feature

```java
package com.acantilado.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class GeoJsonFeature {
    private String type = "Feature";
    private Object geometry;
    private Map<String, Object> properties;
    
    public GeoJsonFeature(Object geometry, Map<String, Object> properties) {
        this.geometry = geometry;
        this.properties = properties;
    }
    
    public String getType() {
        return type;
    }
    
    public Object getGeometry() {
        return geometry;
    }
    
    public Map<String, Object> getProperties() {
        return properties;
    }
}
```

### Step 2: Create a DTO for GeoJSON FeatureCollection

```java
package com.acantilado.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class GeoJsonFeatureCollection {
    private String type = "FeatureCollection";
    private List<GeoJsonFeature> features;
    
    public GeoJsonFeatureCollection(List<GeoJsonFeature> features) {
        this.features = features;
    }
    
    public String getType() {
        return type;
    }
    
    public List<GeoJsonFeature> getFeatures() {
        return features;
    }
}
```

### Step 3: Update Your Resource to Return GeoJSON

```java
@GET
@Produces(MediaType.APPLICATION_JSON)
public GeoJsonFeatureCollection getProvincias() {
    List<Provincia> provincias = provinciaDAO.findAll();
    
    List<GeoJsonFeature> features = provincias.stream()
        .map(provincia -> {
            // Parse the geometryJson string to a Map/Object
            ObjectMapper mapper = new ObjectMapper();
            try {
                Object geometry = mapper.readValue(provincia.getGeometryJson(), Object.class);
                
                Map<String, Object> properties = Map.of(
                    "id", provincia.getId(),
                    "name", provincia.getName(),
                    "comunidadAutonomaId", provincia.getComunidadAutonomaId()
                );
                
                return new GeoJsonFeature(geometry, properties);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse geometry", e);
            }
        })
        .collect(Collectors.toList());
    
    return new GeoJsonFeatureCollection(features);
}
```

## Alternative: Quick Fix (Less Clean)

If you want a quicker solution, you can:

1. Remove `@JsonIgnore` from `geometryJson` in your Provincia class
2. Add a `@JsonProperty("geometry")` annotation
3. Parse it on the frontend

```java
@JsonProperty("geometry")
@Column(name = "geometry", columnDefinition = "TEXT")
private String geometryJson;
```

Then update the frontend to parse it and wrap in FeatureCollection format.

## Recommendation

Use Option 1 (GeoJSON FeatureCollection) as it's the standard format for geographic data and will work seamlessly with Leaflet and other mapping libraries.
