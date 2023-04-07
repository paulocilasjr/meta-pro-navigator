library(plumber)
library(readr)
library (jsonlite)

#* @apiTitle IRON tool
#* Echo provided data to normalize

#* @filter cors
function(req, res) {
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 204
    res$setHeader("Access-Control-Allow-Origin", "*")
    res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res$setHeader("Access-Control-Max-Age", "86400")
    return()
  }
  res$setHeader("Access-Control-Allow-Origin", "*")
  plumber::forward()
}

#* @post /metabolomics_glue
#* @param file1:file The Positive CSV file to upload
#* @param file2:file The Negative CSV file to upload
#* @serializer json
function(req, res){

  # Check if the two files were attached to the request
  if(is.null(req$body$file1) || is.null(req$body$file2)){
    res$status <- 400
    return(list(error = "Both files must be attached to the request"))
  }
  
  # Check if file1 is empty
  if (length(req$body$file1$parsed) == 0){
    res$status <- 400
    return(list(error = "File1 is empty"))
  }
  
  # Check if file2 is empty
  if (length(req$body$file2$parsed) == 0){
    res$status <- 400
    return(list(error = "File2 is empty"))
  }

  folder_path <- "./normalization_pipeline"
  
  tryCatch({
    file_1_name <- req$body$file1$filename
    file_2_name <- req$body$file2$filename
    
    file_path_1 <- file.path(folder_path, file_1_name)
    file_path_2 <- file.path(folder_path, file_2_name)
    
    file1 <- read_csv(req$body$file1$parsed)
    file2 <- read_csv(req$body$file2$parsed)

    write_csv(file1, file_path_1)
    write_csv(file2, file_path_2)
  }, error = function(e) {
    res$status <- 400
    return(list(error = "Check file format - must be CSV files"))
  })
  
  timestamp <- Sys.time()
  file_name <- gsub(" ","", as.character(timestamp))
  
  try(system(paste("cd normalization_pipeline && perl generate_metabolomics_glue_script.pl", file_1_name, file_2_name, file_name, "> run_me.sh;sh run_me.sh"), intern = TRUE, ignore.stderr = TRUE))
  
  print("Done running pipeline")

  log2_file_name <- paste(file_name,"_iron_log2_merged.txt", sep = "")
  qc_file_name <- paste(file_name,"_sample_qc_table.txt", sep = "")
  
  iron_log2 <- read.delim(file.path(folder_path, log2_file_name),sep='\t', header=TRUE, na.strings = "NA", fill=TRUE, blank.lines.skip=TRUE)
  qc_normalize <- read.delim(file.path(folder_path, qc_file_name),sep='\t', header=TRUE, na.strings = "NA", fill=TRUE, blank.lines.skip=TRUE)
  print("Done reading file")

  try(system(paste("cd normalization_pipeline && rm", log2_file_name, "&& rm", qc_file_name), intern = TRUE, ignore.stderr = TRUE))
  print("Done removing files")
  
  print(head(iron_log2, n=10))

  return(list(iron_log2, qc_normalize))
}

#* @apiTitle Health
#* Echo get health of the API
#* @get /health
function (res) {
    response <- list(
      message = "OK",
      status = 200
    )
    return(response)
}