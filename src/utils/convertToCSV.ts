export default function convertToCSV(objArray: Record<string, any>[]) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

export function convertArrayToCSV(array: string[][]){
  var csv = '', row, cell;
  for (row = 0; row < array.length; row++) {
    for (cell = 0; cell < array[row].length; cell++) {
      csv += (array[row][cell]+'').replace(/[\n\t]+/g, ' ');
      if (cell+1 < array[row].length) csv += '\t';
    }
    if (row+1 < array.length) csv += '\n';
  }
  return csv
}