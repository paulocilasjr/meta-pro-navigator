library(plumber)
library(readr)
#* @apiTitle IRON tool
#* Echo provided data to normalize
#* @post /metabolomics_glue
#* @param file1:file The Positive CSV file to upload
#* @param file2:file The Negative CSV file to upload
#* @serializer csv
function(req, res){
  # Check if the two files were attached to the request
  if(is.null(req$body$file1) || is.null(req$body$file1)){
    res$status <- 400
    return(list(error = "Both files must be attached to the request"))
  }
  folder_path <- "./normalization_pipeline"
  
  tryCatch({
    file_1_name <- req$body$file1$filename
    file_2_name <- req$body$file2$filename
    
    file_path_1 <- file.path(folder_path, file_1_name)
    file_path_2 <- file.path(folder_path, file_2_name)
    
    file1 <- read_csv(req$body$file1$parsed)
    file2 <- read_csv(req$body$file2$parsed)

    df <- write_csv(file1, file_path_1)
    df2 <- write_csv(file2, file_path_2)
  }, error = function(e) {
    res$status <- 400
    return(list(error = "Check file format - must be CSV files"))
  })
    timestamp = Sys.time()
    file_name = gsub(" ","", timestamp)
    
    try(system(paste("cd normalization_pipeline && perl generate_metabolomics_glue_script.pl", file_1_name, file_2_name, file_name, "> run_me.sh;sh run_me.sh"), intern = TRUE, ignore.stderr = TRUE))
    
    print("Done running pipeline")

    log2_file_name <- paste(file_name,"_iron_log2_merged.txt", sep = "", collapse = "")
    qc_file_name <- paste(file_name,"_sample_qc_table.txt", sep = "", collapse = "")
    
    iron_log2 <- readLines(paste("./normalization_pipeline/",log2_file_name, sep = "", collapse = ""))
    qc_normalize <- readLines(paste("./normalization_pipeline/",qc_file_name, sep = "", collapse = ""))
    print("Done reading file")

    try(system(paste("cd normalization_pipeline && rm", log2_file_name, "&& rm", qc_file_name), intern = TRUE, ignore.stderr = TRUE))
    print("Done removing files")
    
    return (data.frame(iron_log2))
}
