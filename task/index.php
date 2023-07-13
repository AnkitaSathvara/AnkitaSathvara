<!DOCTYPE html>
<html>
<head>
  <title>API Data Table</title>
  <style>
    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      text-align: center;
      border: 1px solid black;
      padding: 8px;
      
    }
  </style>
</head>
<body>
          
    

   
  <table>
    <thead>
      <tr>
        <th>API</th>
        <th>API Description</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Children</td>
        <td>
          <p>Retrieves information about children of a specific entity</p>
          
        </td>
        <td>
            <select id="selCountry">
                <option value="AI">Anguilla</option>
                <option value="JE">Jersey</option>
                <option value="BM">Bermuda</option>
            </select>
          <button onclick="submit('children')">submit</button>
        </td>
      </tr>
      <tr>
        <td>Timezone</td>
        <td>
           
          <p>Retrieves the timezone information for a specific latitude and longitude coordinates.</p>
          
        </td>
        <td>
            <select id="selCountry">
                <option value="IT">Italy</option>
                <option value="NL">Netherlands</option>
                <option value="AT">Austria</option>
            </select>
          <button onclick="submit('Timezone')">submit</button>
        </td>
      </tr>
      <tr>
        <td>Contains</td>
        <td>
          <p>Determines if a country contains a particular subdivision</p>
          
        </td>
        <td>
            <select id="selCountry">
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="NL">Netherlands</option>
            </select>
          <button onclick="submit('Contains')">submit</button>
        </td>
      </tr>

      <tr >
        <td colspan = "3">Longitude:</td>
       
      </tr>
       
      <tr >
        <td colspan = "3">Latitude:</td>
       
      </tr>
    
      
    </tbody>
  </table>

 
</body>
</html>
